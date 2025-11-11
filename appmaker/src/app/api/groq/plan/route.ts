import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { z } from "zod";

import { planResponseSchema } from "@/lib/schema";
import {
  applyTemplateUpdates,
  buildClarifications,
  type TemplateUpdate,
  serializeTemplateForPrompt,
} from "@/lib/template-helpers";
import type { TemplateSet } from "@/lib/types";

const MODEL = "llama-3.1-70b-versatile";

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      }),
    )
    .min(1, "At least one message is required."),
  template: z.custom<TemplateSet>(),
  vibeScore: z.number().min(0).max(100),
  paletteSummary: z
    .object({
      dominant: z.string(),
      accents: z.array(z.string()),
      descriptiveTone: z.string(),
    })
    .nullable()
    .optional(),
  moodBoard: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        averageColor: z.string(),
        url: z.string().optional(),
      }),
    )
    .optional(),
});

const getGroqClient = (() => {
  let client: Groq | null = null;
  return () => {
    if (client) return client;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured.");
    }
    client = new Groq({
      apiKey,
    });
    return client;
  };
})();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, template, vibeScore, paletteSummary, moodBoard } =
      requestSchema.parse(body);

    if (process.env.APPMAKER_USE_GROQ_STUB === "true") {
      return NextResponse.json(stubPlanResponse(template));
    }

    const prompt = buildPrompt({
      template,
      vibeScore,
      paletteSummary: paletteSummary ?? null,
      moodBoard: moodBoard ?? [],
    });

    const client = getGroqClient();

    const response = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages,
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const assistantContent = response.choices[0]?.message?.content;

    if (!assistantContent) {
      throw new Error("Groq returned an empty response.");
    }

    const parsed = planResponseSchema.safeParse(JSON.parse(assistantContent));

    if (!parsed.success) {
      throw new Error(`Unable to parse Groq response: ${parsed.error.message}`);
    }

    const updates: TemplateUpdate[] = parsed.data.filled_fields.map((field) => ({
      document: field.document,
      sectionId: field.section_id,
      fieldId: field.field_id,
      value: field.value,
    }));

    const nextTemplate = applyTemplateUpdates(template, updates);
    const clarifications = buildClarifications(nextTemplate);

    return NextResponse.json({
      assistantMessage: parsed.data.assistant_message,
      template: nextTemplate,
      clarifications,
    });
  } catch (error) {
    console.error("Groq plan error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json(
      {
        error: "Failed to generate plan from Groq.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

const SYSTEM_PROMPT = `You are AppMaker, a senior product strategist who turns rough app ideas into concrete plans.
You always:
- Use a warm, encouraging tone that still feels expert.
- Respect the provided template structure—only fill a field when you are confident.
- Call out missing information and encourage the user to answer with specifics.
- Keep answers concise but descriptive (2-4 sentences per field when applicable).

Return **strict JSON** matching the schema:
{
  "assistant_message": string,
  "filled_fields": [
    {
      "document": "instructions" | "cursorRules" | "todo",
      "section_id": string,
      "field_id": string,
      "value": string
    }
  ],
  "reasoning": string | undefined
}

Only include entries in filled_fields that you are completing or updating right now. Leave out fields you cannot fill so the app can ask the user for them.`;

type PromptOptions = {
  template: TemplateSet;
  vibeScore: number;
  paletteSummary: {
    dominant: string;
    accents: string[];
    descriptiveTone: string;
  } | null;
  moodBoard: {
    id: string;
    averageColor: string;
    name: string;
  }[];
};

const buildPrompt = ({
  template,
  vibeScore,
  paletteSummary,
  moodBoard,
}: PromptOptions) => {
  const vibeDescriptor =
    vibeScore < 30
      ? "Keep the tone calm and reflective."
      : vibeScore < 60
        ? "Keep the tone balanced and practical."
        : vibeScore < 85
          ? "Lean into energetic, motivating language."
          : "Embrace bold, high-energy language with vivid imagery.";

  const paletteBlock = paletteSummary
    ? `Palette insights: dominant color ${paletteSummary.dominant}, accents ${paletteSummary.accents.join(
        ", ",
      )}. Tone guidance: ${paletteSummary.descriptiveTone}.`
    : "No palette provided. Ask the user if they want to share visuals.";

  const moodBoardSummary =
    moodBoard.length > 0
      ? `Mood board uploads (${moodBoard.length}): ${moodBoard
          .map((asset) => `${asset.name} (~${asset.averageColor})`)
          .join(", ")}. Use these colors/ideas to tailor suggestions.`
      : "No mood board images uploaded yet.";

  return [
    "You are receiving the current session context.",
    vibeDescriptor,
    paletteBlock,
    moodBoardSummary,
    "",
    "Template state:",
    serializeTemplateForPrompt(template),
    "",
    "Task:",
    "- Review the conversation and template.",
    "- Fill any fields you can with concise, specific information.",
    "- For TODO items, describe the concrete action as it applies to this project.",
    "- Keep assistant_message inspiring but clear; recap progress and highlight missing info without listing every empty field.",
    "- Respond in JSON only.",
  ].join("\n");
};

const stubPlanResponse = (template: TemplateSet) => {
  const updates: TemplateUpdate[] = [
    {
      document: "instructions",
      sectionId: "core-idea",
      fieldId: "core-name",
      value: "VibeScaffolder",
    },
    {
      document: "instructions",
      sectionId: "core-idea",
      fieldId: "core-problem",
      value:
        "Helps a solo creator describe an app idea by voice or chat and instantly receives a scoped plan ready for Cursor.",
    },
    {
      document: "cursorRules",
      sectionId: "rules",
      fieldId: "rules-languages",
      value: "TypeScript for both Next.js front end and server routes.",
    },
    {
      document: "todo",
      sectionId: "todo-list",
      fieldId: "todo-1",
      value:
        "Scaffold Next.js App Router project with Tailwind 4, Zustand, and essential layout components.",
    },
  ];

  const nextTemplate = applyTemplateUpdates(template, updates);
  const clarifications = buildClarifications(nextTemplate);

  return {
    assistantMessage:
      "Here’s a quick pass based on the stub generator. I filled in core positioning and a few rules so you can see the format—toggle off stub mode to hit Groq for real content.",
    template: nextTemplate,
    clarifications,
  };
};
