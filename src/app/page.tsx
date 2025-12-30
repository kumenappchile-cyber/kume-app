"use client";

import Link from "next/link";
import Image from "next/image";
import { KUME_BG } from "@/lib/kume/ui";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <main className={`min-h-dvh text-neutral-100 ${KUME_BG}`}>
      {/* Header */}
      <header className="mx-auto w-full max-w-5xl px-6 pt-10 pb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/[0.08] ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
              <Image
                src="/kume-logo.png"
                alt="KÜME"
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
                priority
              />
            </div>

            <div>
              <div className="text-sm font-semibold tracking-wide">KÜME</div>
              <div className="text-xs text-neutral-200/80">
                tu compañero incansable hacia una vida consciente
              </div>
            </div>
          </div>

          <Link
            href="/session"
            className="rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-neutral-950 hover:opacity-95 transition"
          >
            Iniciar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-7 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <h1 className="text-2xl font-semibold leading-tight">
            KÜME es un espacio de acompañamiento consciente.
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-100/80 max-w-2xl">
            Te ayuda a detener el automático  
            y volver a mirarte con claridad.
            <br /><br />
            Está diseñado para esos momentos donde aparece la confusión,
            la ansiedad, el impulso o el ruido mental.
            <br /><br />
            KÜME te acompaña con preguntas simples y un tono humano,
            para que tu propia brújula interna vuelva a aparecer.
            <br /><br />
            Es una pausa.  
            Un reflejo.  
            Un espacio donde observar lo que hoy ocurre en ti.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs">
              1–3 preguntas
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs">
              sin moral
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs">
              sin tareas obligatorias
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs">
              ritmo antes que profundidad
            </span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/session"
              className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 hover:opacity-95 transition text-center"
            >
              Entrar hoy
            </Link>

            <a
              href="#como-funciona"
              className="flex-1 rounded-2xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-semibold hover:bg-white/[0.10] transition text-center"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>
      </section>

      {/* Qué no es */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6">
          <h3 className="text-sm font-semibold">Lo que KÜME no es</h3>
          <ul className="mt-3 space-y-2 text-sm text-neutral-100/80 leading-6">
            <li>• No es terapia.</li>
            <li>• No te diagnostica.</li>
            <li>• No te empuja.</li>
            <li>• No te dice qué hacer.</li>
            <li>• No reemplaza apoyo humano ni profesional.</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/10 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-6 py-8 text-xs text-neutral-200/70 flex items-center justify-between">
          <span>© {year} KÜME</span>
          <span className="text-neutral-200/50">versión privada</span>
        </div>
      </footer>
    </main>
  );
}
