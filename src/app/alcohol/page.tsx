"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { KUME_BG } from "@/lib/kume/ui";

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "daily" | "urgent" | "relapse";

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="inline-block h-2 w-2 rounded-full bg-neutral-200/80 animate-bounce [animation-delay:-0.2s]" />
      <span className="inline-block h-2 w-2 rounded-full bg-neutral-200/80 animate-bounce [animation-delay:-0.1s]" />
      <span className="inline-block h-2 w-2 rounded-full bg-neutral-200/80 animate-bounce" />
    </div>
  );
}

export default function EnergyAndConsumptionPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Estás aquí.\n\nNo para prometer nada.\nNo para controlarte.\n\nSolo para mirar con honestidad.\n\n¿Qué está pasando hoy con tu energía y tus impulsos?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("daily");

  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, loading]);

  function modeLabel(m: Mode) {
    if (m === "urgent") return "Impulso";
    if (m === "relapse") return "Ruptura";
    return "Diario";
  }

  function pickQuickText(m: Mode) {
    if (m === "urgent") return "Estoy sintiendo un impulso fuerte ahora.";
    if (m === "relapse") return "Hoy volví a un consumo que quiero observar.";
    return "";
  }

  function selectMode(m: Mode) {
    setMode(m);
    setInput((prev) => (prev.trim().length ? prev : pickQuickText(m)));

    requestAnimationFrame(() => {
      taRef.current?.focus();
      const el = taRef.current;
      if (el) el.selectionStart = el.selectionEnd = el.value.length;
    });
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/alcohol/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, messages: nextMessages }),
        cache: "no-store",
      });

      const data = await res.json();
      const reply = String(data?.text || "").trim() || "…";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);

      if (mode !== "daily") setMode("daily");
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Hubo un problema técnico.\nNo tiene que ver contigo.\n\nPor hoy, es suficiente.\nNo estás solo con esto.",
        },
      ]);
      if (mode !== "daily") setMode("daily");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => taRef.current?.focus());
    }
  }

  const pill =
    mode === "urgent"
      ? "bg-rose-500/20 text-rose-100 border-rose-400/30"
      : mode === "relapse"
      ? "bg-amber-500/20 text-amber-100 border-amber-400/30"
      : "bg-emerald-500/20 text-emerald-100 border-emerald-400/30";

  return (
    <main
      className={`min-h-dvh text-neutral-100 flex items-center justify-center p-5 ${KUME_BG}`}
    >
      <section className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">KÜME</div>
            <div className="text-xs text-neutral-300">
              Sendero · Energía y consumo
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`rounded-full border px-3 py-1 text-xs ${pill}`}>
              {modeLabel(mode)}
            </div>
            <Link href="/" className="text-xs text-neutral-300 hover:underline">
              salir
            </Link>
          </div>
        </div>

        {/* Mensajes */}
        <div className="space-y-3 max-h-[52dvh] overflow-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "assistant"
                  ? "rounded-2xl bg-white/[0.08] border border-white/10 px-4 py-3 text-sm leading-6 whitespace-pre-wrap"
                  : "rounded-2xl bg-white text-neutral-950 px-4 py-3 text-sm whitespace-pre-wrap ml-8"
              }
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="rounded-2xl bg-white/[0.08] border border-white/10 px-4 py-3 text-sm leading-6">
              <ThinkingDots />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Controles */}
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => selectMode("urgent")}
              disabled={loading}
              className={[
                "rounded-2xl px-3 py-2 text-xs transition disabled:opacity-60 border",
                mode === "urgent"
                  ? "bg-rose-200 text-neutral-950 border-rose-200"
                  : "bg-white/[0.06] border-white/20 text-neutral-100 hover:bg-white/[0.10]",
              ].join(" ")}
            >
              Siento un impulso ahora
            </button>

            <button
              type="button"
              onClick={() => selectMode("relapse")}
              disabled={loading}
              className={[
                "rounded-2xl px-3 py-2 text-xs transition disabled:opacity-60 border",
                mode === "relapse"
                  ? "bg-amber-200 text-neutral-950 border-amber-200"
                  : "bg-white/[0.06] border-white/20 text-neutral-100 hover:bg-white/[0.10]",
              ].join(" ")}
            >
              Hoy volví a consumir
            </button>
          </div>

          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe una frase…"
            rows={3}
            disabled={loading}
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-cyan-300/40"
          />

          <button
            type="button"
            onClick={send}
            disabled={loading || !input.trim()}
            className="w-full rounded-2xl bg-white text-neutral-950 px-4 py-3 text-sm font-semibold disabled:opacity-60 hover:opacity-95 transition"
          >
            {loading ? "KÜME está contigo…" : "Enviar"}
          </button>

          <div className="text-[11px] text-neutral-300/80">
            Tip: usa “Siento un impulso ahora” solo si es intenso.  
            Si no, quédate en Diario.
          </div>
        </div>
      </section>
    </main>
  );
}
