"use client";

import { useAppStore } from "@/state/app-store";
import { ClipboardCheck } from "lucide-react";

export const ClarificationPanel = () => {
  const clarifications = useAppStore((state) => state.clarifications);

  return (
    <section className="rounded-2xl border border-white/10 bg-black/40 p-5 shadow-lg shadow-black/40 backdrop-blur">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Clarifications</p>
            <h3 className="text-lg font-semibold text-white">
              Questions AppMaker still needs you to answer
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
              {clarifications.length}
            </span>
            <ClipboardCheck className="h-5 w-5 text-accent" />
          </div>
      </header>
      {clarifications.length === 0 ? (
        <p className="text-sm text-white/50">
          Once Groq fills the template, any missing answers will appear here with examples and
          recommendations ready to go.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {clarifications.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-white/80"
            >
              <header className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">
                {item.document} · {item.sectionId}
              </header>
              <p className="font-medium text-white">{item.question}</p>
              <p className="mt-2 text-xs text-white/60">{item.example}</p>
              <p className="mt-1 text-xs text-white/50">{item.recommendation}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
