"use client";

import React, { useEffect, useMemo, useRef } from "react";

export type KumeMsg = {
  role: "user" | "assistant";
  content: string;
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="inline-block h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.2s]" />
      <span className="inline-block h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.1s]" />
      <span className="inline-block h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
    </div>
  );
}

export default function ChatThread({
  messages,
  isThinking,
  className = "",
}: {
  messages: KumeMsg[];
  isThinking?: boolean;
  className?: string;
}) {
  const endRef = useRef<HTMLDivElement | null>(null);

  // “Avanza la pantalla” cuando cambian los mensajes o el estado de thinking.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isThinking]);

  const rendered = useMemo(() => {
    return messages.map((m, idx) => {
      const isUser = m.role === "user";
      return (
        <div
          key={idx}
          className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
        >
          <div
            className={[
              "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
              isUser
                ? "bg-blue-600 text-white"
                : "bg-white/90 text-slate-900 ring-1 ring-slate-200",
            ].join(" ")}
          >
            {m.content}
          </div>
        </div>
      );
    });
  }, [messages]);

  return (
    <div
      className={[
        "flex-1 overflow-y-auto px-4 pb-6 pt-4",
        "scroll-smooth",
        className,
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        {rendered}

        {isThinking ? (
          <div className="flex w-full justify-start">
            <div className="max-w-[85%] rounded-2xl bg-white/90 ring-1 ring-slate-200 shadow-sm">
              <TypingDots />
            </div>
          </div>
        ) : null}

        <div ref={endRef} />
      </div>
    </div>
  );
}
