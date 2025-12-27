"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getSenderoToday, setSenderoToday } from "@/lib/kume/sendero";
import { KUME_BG } from "@/lib/kume/ui";

export default function SessionEntryPage() {
  const router = useRouter();

  useEffect(() => {
    const sendero = getSenderoToday();
    if (sendero === "alcohol") router.replace("/alcohol");
    if (sendero === "conciencia") router.replace("/session/conciencia");
  }, [router]);

  return (
    <main className={`min-h-dvh text-neutral-100 flex items-center justify-center p-5 ${KUME_BG}`}>
      <section className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">KÜME</div>
            <div className="text-xs text-neutral-300">Entrada de hoy</div>
          </div>

          <Link href="/" className="text-xs text-neutral-300 hover:underline">
            salir
          </Link>
        </div>

        {/* Prompt */}
        <div className="rounded-2xl bg-white/[0.08] border border-white/10 px-4 py-3 text-sm leading-6 whitespace-pre-wrap">
          Antes de empezar: ¿qué sendero necesitas hoy?
        </div>

        {/* Buttons */}
        <div className="mt-4 space-y-2">
          <button
            className="w-full rounded-2xl bg-cyan-300 text-neutral-950 px-4 py-3 text-sm font-semibold hover:opacity-95 transition"
            onClick={() => {
              setSenderoToday("conciencia");
              router.push("/session/conciencia");
            }}
          >
            Conciencia
          </button>

          <button
            className="w-full rounded-2xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-neutral-100 hover:bg-white/[0.10] transition"
            onClick={() => {
              setSenderoToday("alcohol");
              router.push("/alcohol");
            }}
          >
            Alcohol (hoy está presente)
          </button>

          <div className="pt-2 text-[11px] text-neutral-300/80">
            No es un test. Es solo elegir por dónde entrar hoy.
          </div>
        </div>
      </section>
    </main>
  );
}
