"use client";

import { useState } from "react";
import { ClipboardList, BookOpenCheck, Kanban, CheckCircle2 } from "lucide-react";

import { useAppStore } from "@/state/app-store";
import type { TemplateDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "instructions", label: "Instructions", icon: BookOpenCheck },
  { id: "cursorRules", label: "Cursor Rules", icon: ClipboardList },
  { id: "todo", label: "TODO Checklist", icon: Kanban },
] as const;

export const TemplatePanel = () => {
  const template = useAppStore((state) => state.template);
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("instructions");

  const activeDocument: TemplateDocument = template[activeTab];

  return (
    <section className="flex h-full flex-col gap-5">
      <header className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 shadow-lg shadow-black/40 backdrop-blur">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Template Output</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Instructions · Rules · TODOs</h2>
      </header>
      <div className="flex items-center gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition",
                isActive
                  ? "border-accent/60 bg-accent/20 text-accent shadow-accent/40"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white/90",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-6 shadow-inner shadow-black/50">
        <div className="flex h-full flex-col gap-6 overflow-y-auto pr-4">
          {activeDocument.map((section) => (
            <article
              key={section.id}
              className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-lg shadow-black/40"
            >
              <header className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  {section.description && (
                    <p className="mt-1 text-xs text-white/60">{section.description}</p>
                  )}
                </div>
                <StatusBadge sectionFields={section.fields} />
              </header>
              <div className="flex flex-col gap-4">
                {section.fields.map((field) => (
                  <div
                    key={field.id}
                    className="rounded-xl border border-white/5 bg-black/30 p-4 transition hover:border-accent/40 hover:bg-black/20"
                  >
                    <p className="text-sm font-medium text-white/90">{field.prompt}</p>
                    <div className="mt-2 flex flex-col gap-2 text-xs leading-relaxed text-white/70">
                      <p className="text-white/50">{field.example}</p>
                      <p className="text-white/45">{field.recommendation}</p>
                    </div>
                    <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/80">
                      {field.value ? (
                        <p className="whitespace-pre-wrap">{field.value}</p>
                      ) : (
                        <p className="text-white/40">Awaiting AppMaker fill-in...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatusBadge = ({ sectionFields }: { sectionFields: TemplateDocument[number]["fields"] }) => {
  const complete = sectionFields.every((field) => field.value.trim().length > 0);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-medium uppercase tracking-[0.3em]",
        complete ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/60",
      )}
    >
      <CheckCircle2 className="h-4 w-4" />
      {complete ? "Filled" : "Pending"}
    </span>
  );
};
