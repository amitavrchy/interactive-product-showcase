"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { chatWithAi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { CitationCard } from "./CitationCard";

type Msg = {
  role: "user" | "assistant";
  content: string;
  citations?: { slug: string; title: string; snippet: string }[];
};

type Props = {
  productSlug?: string;
  compact?: boolean;
};

export function ChatPanel({ productSlug, compact }: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I’m NOVA’s product expert. Ask about drivers, battery, colors, or what to gift.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    liveRef.current?.scrollTo({ top: liveRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await chatWithAi({
        messages: next.map((m) => ({ role: m.role, content: m.content })),
        productSlug,
      });
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.answer ?? "I couldn’t find that in the catalog.",
          citations: res.citations,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`flex flex-col bg-panel ${
        compact
          ? "h-[min(58vh,440px)] border-0"
          : "h-[min(70vh,720px)] border border-line"
      }`}
    >
      <div
        ref={liveRef}
        role="log"
        aria-live="polite"
        className="flex-1 space-y-4 overflow-y-auto p-5"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[90%] text-[14px] leading-relaxed md:text-[15px] ${
              m.role === "user" ? "ml-auto bg-accent/15 px-4 py-3 text-text" : "text-muted"
            }`}
          >
            <p className={m.role === "assistant" ? "text-text" : undefined}>{m.content}</p>
            {m.citations?.length ? (
              <div className="mt-3 space-y-2">
                {m.citations.map((c) => (
                  <CitationCard key={c.slug + c.snippet.slice(0, 12)} {...c} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {loading && (
          <p className="font-mono text-[14px] text-accent-2">Listening to the catalog…</p>
        )}
      </div>
      <form
        className="flex gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about ANC, battery, gifts…"
          className="min-w-0 flex-1 border border-line bg-void px-4 py-3 text-[14px] outline-none focus:border-accent-2"
          aria-label="Message to NOVA AI"
        />
        <Button type="submit" variant="mint" disabled={loading}>
          Send
        </Button>
      </form>
      {!compact && (
        <p className="border-t border-line px-4 py-2 text-[14px] text-muted">
          Prefer browsing?{" "}
          <Link href="/products" className="text-accent-2 underline-offset-2 hover:underline">
            Open catalog
          </Link>
        </p>
      )}
    </div>
  );
}
