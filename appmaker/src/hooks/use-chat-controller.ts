"use client";

import { useCallback } from "react";

import { useAppStore } from "@/state/app-store";

export const useChatController = () => {
  const {
    addMessage,
    setProcessing,
    isProcessing,
    appendMessages,
    replaceTemplate,
    setClarifications,
    vibeScore,
    paletteSummary,
    moodBoard,
    template,
  } = useAppStore((state) => ({
    addMessage: state.addMessage,
    setProcessing: state.setProcessing,
    appendMessages: state.appendMessages,
    replaceTemplate: state.replaceTemplate,
    setClarifications: state.setClarifications,
    vibeScore: state.vibeScore,
    paletteSummary: state.paletteSummary,
    moodBoard: state.moodBoard,
    template: state.template,
    isProcessing: state.isProcessing,
  }));

  const sendUserMessage = useCallback(
    async (content: string, source: "text" | "voice" = "text") => {
      if (!content.trim()) return;

      const trimmed = content.trim();

      const existingMessages = useAppStore.getState().messages;

      addMessage({
        role: "user",
        content: trimmed,
        source,
      });

      setProcessing(true);

      try {
        const messagesPayload = [...existingMessages, { role: "user", content: trimmed }].filter(
          (message) => message.role === "user" || message.role === "assistant",
        );

        const response = await fetch("/api/groq/plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messagesPayload.map(({ role, content }) => ({
              role,
              content,
            })),
            template,
            vibeScore,
            paletteSummary,
            moodBoard: moodBoard.map(({ id, averageColor, name }) => ({
              id,
              averageColor,
              name,
            })),
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody?.details || "Groq request failed.");
        }

        const data = await response.json();

        if (data.template) {
          replaceTemplate(data.template);
        }
        if (Array.isArray(data.clarifications)) {
          setClarifications(data.clarifications);
        }

        appendMessages([
          {
            role: "assistant",
            content:
              data.assistantMessage ??
              "I processed your idea. Let me know if you want to refine anything further!",
          },
        ]);
      } catch (error) {
        console.error("sendUserMessage error", error);
        appendMessages([
          {
            role: "system",
            content:
              error instanceof Error
                ? `I couldn't reach Groq: ${error.message}. Double-check your GROQ_API_KEY and try again.`
                : "Something went wrong talking to Groq. Please try again.",
          },
        ]);
      } finally {
        setProcessing(false);
      }
    },
    [
      addMessage,
      appendMessages,
      setProcessing,
      template,
      vibeScore,
      paletteSummary,
      moodBoard,
      replaceTemplate,
      setClarifications,
    ],
  );

  return {
    sendUserMessage,
    isProcessing,
  };
};
