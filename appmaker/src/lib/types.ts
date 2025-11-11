export type Role = "user" | "assistant" | "system";

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  source?: "text" | "voice" | "system";
};

export type TemplateField = {
  id: string;
  prompt: string;
  example: string;
  recommendation: string;
  value: string;
};

export type TemplateSection = {
  id: string;
  title: string;
  description?: string;
  fields: TemplateField[];
};

export type TemplateDocument = TemplateSection[];

export type TemplateSet = {
  instructions: TemplateDocument;
  cursorRules: TemplateDocument;
  todo: TemplateDocument;
};

export type ClarificationItem = {
  id: string;
  fieldId: string;
  sectionId: string;
  document: "instructions" | "cursorRules" | "todo";
  question: string;
  example: string;
  recommendation: string;
};

export type MoodBoardAsset = {
  id: string;
  url: string;
  averageColor: string;
  name: string;
};

export type PaletteSummary = {
  dominant: string;
  accents: string[];
  descriptiveTone: string;
};
