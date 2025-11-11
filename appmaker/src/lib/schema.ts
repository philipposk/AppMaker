import { z } from "zod";

export const planUpdateSchema = z.object({
  document: z.enum(["instructions", "cursorRules", "todo"]),
  section_id: z.string(),
  field_id: z.string(),
  value: z.string(),
});

export const planResponseSchema = z.object({
  assistant_message: z
    .string()
    .describe("Assistant response summarizing progress and next steps."),
  filled_fields: z.array(planUpdateSchema).default([]),
  reasoning: z
    .string()
    .optional()
    .describe("Optional self-check for the assistant."),
});

export type PlanResponse = z.infer<typeof planResponseSchema>;
