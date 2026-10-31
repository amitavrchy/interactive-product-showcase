"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setChatOpen } from "@/features/ui/uiSlice";
import { ChatPanel } from "./ChatPanel";

export function AssistantWidget() {
  const open = useAppSelector((s) => s.ui.chatOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-[min(100vw-1.5rem,400px)] overflow-hidden rounded-2xl border border-line/80 bg-panel/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-2/15 text-accent-2">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[14px] font-medium text-text">NOVA AI</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    Concierge
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close assistant"
                onClick={() => dispatch(setChatOpen(false))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-muted hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ChatPanel compact />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        onClick={() => dispatch(setChatOpen(!open))}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="pointer-events-auto group relative inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-full border border-accent-2/30 bg-void px-5 text-[14px] font-medium text-accent-2 shadow-[0_0_0_1px_rgba(124,255,178,0.12),0_12px_40px_rgba(0,0,0,0.45)] transition hover:border-accent-2/60 hover:shadow-[0_0_40px_rgba(124,255,178,0.22)]"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(124,255,178,0.18),transparent_55%)]" />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent-2 text-void">
          {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        </span>
        <span className="relative hidden sm:inline">{open ? "Close" : "Ask NOVA"}</span>
      </motion.button>
    </div>
  );
}
