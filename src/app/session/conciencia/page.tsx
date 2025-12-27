"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getOrCreateStartDateISO, pickDailyQuestionFromStartDate } from "@/lib/kume/questions";
import { clearSenderoToday } from "@/lib/kume/sendero";
import { KUME_BG } from "@/lib/kume/ui";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type Mode = "daily" | "deep";

function toText(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const anyV = v as any;
    if (typeof anyV.text === "string") return anyV.text;
    if (typeof anyV.content === "string") return anyV.content;
  }
  if (v == null) return "";
  return String(v);
}

export default function ConcienciaSessionPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("daily");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [deepInvite, setDeepInvite] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending]
  );

  useEffect(() => {
   const startISO = getOrCreateStartDateISO(new Date());
const qObj = pickDailyQuestionFromStartDate(startISO, new Date());
const q = (qObj.text || "").trim();	


    const initial: ChatMessage[] = [
      {
        role: "assistant",
        content: "Hola.\nRespira un momento.\n\nNo tienes que cambiar nada ahora.",
      },
      {
        role: "assistant",
        content: q || "¿Qué parte de tu día hoy se sintió más pesada de sostener?",
      },
    ];

    setMessages(initial);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, deepInvite]);

  async function sendUserMessage(text: string, overrideMode?: Mode) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSending(true);
    setDeepInvite(false);

    const actualMode = overrideMode ?? mode;
    const nextMessages: ChatMessage[] = [
  ...messages,
  { role: "user", content: trimmed },
];

setMessages(nextMessages);
    setInput("");

    try {
      const res = await fetch("/api/conciencia/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: actualMode, messages: nextMessages }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.detail || "Error");

      if (data?.text) {
        setMessages((prev) => [...prev, { role: "assistant", content: toText(data.text) }]);
      }

      if (data?.suggestDeep && actualMode === "daily") {
        setDeepInvite(true);
      }

      if (actualMode === "deep" && data?.done) {
        setMode("daily");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Se cortó un momento.\n\nPor hoy, es suficiente." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleChangeSendero() {
    clearSenderoToday();
    router.push("/session");
  }

  return (
    <main className={`min-h-dvh text-neutral-100 flex items-center justify-center p-5 ${KUME_BG}`}>
      <section className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">KÜME</div>
            <div className="text-xs text-neutral-300">
              Conciencia · {mode === "deep" ? "Profundo" : "Diario"}
            </div>
          </div>
          <div className="flex gap-3 text-xs text-neutral-300">
            <button onClick={handleChangeSendero} className="hover:underline">
              cambiar sendero
            </button>
            <Link href="/" className="hover:underline">
              salir
            </Link>
          </div>
        </div>

        {/* Mensajes */}
        <div className="space-y-3 max-h-[55dvh] overflow-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "assistant"
                  ? "rounded-2xl bg-cyan-500/[0.08] px-4 py-3 text-sm whitespace-pre-wrap"
                  : "rounded-2xl bg-white text-neutral-950 px-4 py-3 text-sm whitespace-pre-wrap ml-8"
              }
            >
              {m.content}
            </div>
          ))}

          {deepInvite && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
              <div className="text-sm mb-3">
                Esto que nombras se siente más profundo que el día de hoy.
                {"\n"}Si quieres, podemos quedarnos un poco más con esto.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMode("deep");
                    sendUserMessage("Sí. Quedémonos un poco más con esto.", "deep");
                  }}
                  className="flex-1 rounded-xl bg-cyan-300 text-neutral-950 px-4 py-2 text-sm font-semibold"
                >
                  Sí
                </button>
                <button
                  onClick={() => setDeepInvite(false)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm"
                >
                  No, por ahora
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="mt-4 space-y-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe una frase…"
            className="w-full min-h-[80px] resize-none rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm"
          />

          <button
            disabled={!canSend}
            onClick={() => sendUserMessage(input)}
            className="w-full rounded-2xl bg-white text-neutral-950 px-4 py-3 text-sm font-semibold disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </section>
    </main>
  );
}
