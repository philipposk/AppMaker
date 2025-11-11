import { ChatPanel } from "@/components/chat/chat-panel";
import { TemplatePanel } from "@/components/template/template-panel";
import { VibeMeter } from "@/components/vibe/vibe-meter";
import { ClarificationPanel } from "@/components/clarifications/clarification-panel";
import { MoodBoard } from "@/components/mood/mood-board";
import { CursorExportPanel } from "@/components/cursor/cursor-export";

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden pb-16">
      <BackgroundGlow />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-16 md:px-8 lg:px-12">
        <Hero />
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="flex flex-col gap-6">
            <ChatPanel />
            <div className="grid gap-4 lg:grid-cols-2">
              <VibeMeter />
              <ClarificationPanel />
            </div>
            <MoodBoard />
          </div>
          <div className="flex h-full flex-col gap-6">
            <TemplatePanel />
            <CursorExportPanel />
          </div>
        </div>
      </div>
    </main>
  );
}

const Hero = () => (
  <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent px-8 py-10 shadow-xl shadow-black/40 backdrop-blur">
    <p className="text-xs uppercase tracking-[0.4em] text-white/60">AppMaker · Vibecoding lab</p>
    <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
      Chat or speak your next app idea. AppMaker fills{" "}
      <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--glow)" }}>
        Instructions, Cursor Rules, and TODOs
      </span>{" "}
      automatically.
    </h1>
    <p className="mt-4 max-w-2xl text-base text-white/70">
      Groq powers the brainstorming. Mood boards, vibe meters, and clarifications keep every build
      aligned with the energy you want—ready for Cursor exports.
    </p>
  </section>
);

const BackgroundGlow = () => (
  <div aria-hidden className="pointer-events-none">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-[-20%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute right-[-10%] top-[-10%] h-[35rem] w-[35rem] rounded-full bg-[#ff5fc1]/20 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[30%] h-[28rem] w-[28rem] rounded-full bg-[#30d8ff]/20 blur-3xl" />
    </div>
  </div>
);
