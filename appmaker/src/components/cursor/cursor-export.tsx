"use client";

import { useMemo, useState } from "react";
import { FileOutput, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

import { useAppStore } from "@/state/app-store";
import { cn } from "@/lib/utils";

type ExportStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export const CursorExportPanel = () => {
  const { template, clarifications } = useAppStore((state) => ({
    template: state.template,
    clarifications: state.clarifications,
  }));
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<ExportStatus>({ state: "idle" });

  const inferredName = useMemo(() => {
    const coreIdeaSection = template.instructions.find((section) => section.id === "core-idea");
    const field = coreIdeaSection?.fields.find((entry) => entry.id === "core-name");
    return field?.value.trim() || "AppMaker Project";
  }, [template]);

  const pendingClarifications = clarifications.length > 0;

  const handleExport = async () => {
    setStatus({ state: "loading" });
    try {
      const response = await fetch("/api/cursor/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template,
          metadata: {
            appName: inferredName,
            note: note.trim() || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          "Cursor export failed. Check that your credentials are configured.";
        setStatus({ state: "error", message });
        return;
      }

      setStatus({
        state: "success",
        message: data?.message ?? "Export stub queued. Check server logs for payload preview.",
      });
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error ? error.message : "Unexpected error while triggering export.",
      });
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-black/40 p-5 shadow-lg shadow-black/40 backdrop-blur">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Cursor handoff</p>
          <h3 className="text-lg font-semibold text-white">Push this plan into your workspace</h3>
        </div>
        <FileOutput className="h-5 w-5 text-accent" />
      </header>
      <p className="mt-3 text-sm text-white/60">
        App name inferred as <span className="font-semibold text-white">{inferredName}</span>.
        Update the Core Idea · Name field in Instructions to change this before export.
      </p>
      {pendingClarifications && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            {clarifications.length} clarification
            {clarifications.length === 1 ? "" : "s"} pending. Export anyway or answer them first so
            your Cursor files ship fully populated.
          </p>
        </div>
      )}
      <label className="mt-4 block text-xs uppercase tracking-[0.3em] text-white/50">
        Optional note to include with export
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
          placeholder="E.g. “Kick off neon writer build – align with synthwave palettes.”"
          rows={2}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleExport}
          disabled={status.state === "loading"}
          className={cn(
            "flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:shadow-accent/50 disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {status.state === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting…
            </>
          ) : (
            <>
              <FileOutput className="h-4 w-4" />
              Export to Cursor
            </>
          )}
        </button>
        {status.state === "success" && (
          <span className="flex items-center gap-1 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {status.message}
          </span>
        )}
        {status.state === "error" && (
          <span className="flex items-center gap-1 text-xs text-rose-300">
            <AlertTriangle className="h-4 w-4" />
            {status.message}
          </span>
        )}
      </div>
    </section>
  );
};
