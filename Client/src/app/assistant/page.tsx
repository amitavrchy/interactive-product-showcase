import { ChatPanel } from "@/components/ai/ChatPanel";

export const metadata = {
  title: "AI Concierge",
  description: "Ask NOVA’s catalog-grounded shopping assistant.",
};

export default function AssistantPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,255,178,0.1),transparent_50%)]" />
      <div className="relative mx-auto max-w-3xl px-5 py-14 md:px-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-accent-2">
          Assistant
        </p>
        <h1 className="font-display mt-3 text-[clamp(2.4rem,5vw,3.8rem)] font-semibold">
          Meet NOVA AI
        </h1>
        <p className="mt-4 max-w-xl text-[16px] text-muted">
          Answers cite real catalog chunks — drivers, battery, finishes, and gift angles.
        </p>
        <div className="mt-10">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
