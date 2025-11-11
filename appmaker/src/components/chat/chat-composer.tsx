"use client";

import { useRef, useState } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useChatController } from "@/hooks/use-chat-controller";

type ChatComposerProps = {
  className?: string;
};

export const ChatComposer = ({ className }: ChatComposerProps) => {
  const [draft, setDraft] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { sendUserMessage, isProcessing } = useChatController();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;

    await sendUserMessage(draft.trim(), "text");
    setDraft("");
  };

  const handleVoiceToggle = async () => {
    if (isProcessing || isTranscribing) return;

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener("stop", async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        chunksRef.current = [];
        cleanupStream();
        await transcribeBlob(blob);
      });

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Voice capture error", error);
      cleanupStream();
    }
  };

  const cleanupStream = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    setIsRecording(false);
  };

  const transcribeBlob = async (blob: Blob) => {
    if (blob.size === 0) return;
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", blob, `appmaker-voice-${Date.now()}.webm`);
      const response = await fetch("/api/groq/transcribe", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.details || "Transcription failed.");
      }
      const data: { text?: string } = await response.json();
      if (data.text) {
        setDraft((prev) => (prev ? `${prev.trim()} ${data.text}` : data.text));
        await sendUserMessage(data.text, "voice");
        setDraft("");
      }
    } catch (error) {
      console.error("Transcription error", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 shadow-lg shadow-black/30 backdrop-blur-lg transition",
        "focus-within:border-accent/70 focus-within:bg-white/10",
        className,
      )}
    >
      <label htmlFor="appmaker-message" className="text-xs uppercase tracking-[0.2em] text-white/60">
        Drop your idea or follow-up
      </label>
      <textarea
        id="appmaker-message"
        className="min-h-[120px] resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
        placeholder="“I want an app that playlists my mood and drafts landing pages for each vibe...”"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        disabled={isProcessing}
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleVoiceToggle}
          disabled={isProcessing || isTranscribing}
          className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isTranscribing ? (
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
          ) : isRecording ? (
            <MicOff className="h-4 w-4 text-rose-400" />
          ) : (
            <Mic className="h-4 w-4 text-accent" />
          )}
          {isTranscribing ? "Transcribing..." : isRecording ? "Stop recording" : "Voice capture"}
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:shadow-accent/50 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isProcessing || isTranscribing}
        >
          {isProcessing ? "Thinking..." : "Send to AppMaker"}
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
