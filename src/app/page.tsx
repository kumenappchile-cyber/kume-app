"use client";

import Link from "next/link";
import Image from "next/image";
import { KUME_BG } from "@/lib/kume/ui";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <main className={`min-h-dvh text-neutral-100 ${KUME_BG}`}>
      {/* Top */}
      <header className="mx-auto w-full max-w-5xl px-6 pt-10 pb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* Logo */}
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

          <div className="flex items-center gap-3">
            <Link
              href="/session"
              className="rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-neutral-950 hover:opacity-95 transition"
            >
              Iniciar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.55)]">
          <h1 className="text-2xl font-semibold leading-tight">
            KÜME no te arregla.
            <br />
            Te acompaña a verte con claridad.
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-100/80 max-w-2xl">
            KÜME está diseñado para los momentos donde el automático vuelve:
            confusión, ansiedad, impulso, ruido mental. No te da un sermón, no te
            diagnostica, no te empuja. Te sostiene con preguntas simples y una
            presencia humana, para que tu propia brújula interna reaparezca.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-neutral-100/80">
              1–3 preguntas
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-neutral-100/80">
              sin moral
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-neutral-100/80">
              sin tareas obligatorias
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-neutral-100/80">
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
              className="flex-1 rounded-2xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-neutral-100 hover:bg-white/[0.10] transition text-center"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="mx-auto w-full max-w-5xl px-6 pb-12">
        <h2 className="text-lg font-semibold">Cómo funciona</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-100/80 max-w-3xl">
          KÜME funciona con una idea simple: cada día eliges por dónde entrar y
          conversas lo justo y necesario. No se trata de acumular ejercicios;
          se trata de recuperar presencia.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6">
            <div className="text-xs text-neutral-200/70">Paso 1</div>
            <div className="mt-1 text-sm font-semibold">Eliges un sendero</div>
            <p className="mt-2 text-sm leading-6 text-neutral-100/80">
              Al iniciar, KÜME no decide por ti. Tú eliges:
              <span className="text-neutral-100"> Conciencia</span> o
              <span className="text-neutral-100"> Alcohol</span>.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6">
            <div className="text-xs text-neutral-200/70">Paso 2</div>
            <div className="mt-1 text-sm font-semibold">Una conversación breve</div>
            <p className="mt-2 text-sm leading-6 text-neutral-100/80">
              KÜME hace preguntas simples y devuelve lo que escucha con cuidado.
              En Conciencia suele ser entre 1 y 3 preguntas.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6">
            <div className="text-xs text-neutral-200/70">Paso 3</div>
            <div className="mt-1 text-sm font-semibold">Cierre sin cortar</div>
            <p className="mt-2 text-sm leading-6 text-neutral-100/80">
              Si aparece calma o claridad, KÜME cierra con suavidad:
              <span className="text-neutral-100"> “Por hoy, es suficiente.”</span>
            </p>
          </div>
        </div>
      </section>

      {/* Modes */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-12">
        <h2 className="text-lg font-semibold">Modos</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-100/80 max-w-3xl">
          KÜME no es un “curso” ni un “sistema de etapas”. Tiene modos de
          acompañamiento según lo que aparezca.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6">
            <div className="text-sm font-semibold">Modo Presencia</div>
            <div className="mt-1 text-xs text-neutral-200/70">Conciencia · Diario</div>
            <p className="mt-3 text-sm leading-6 text-neutral-100/80">
              Para el día a día. Preguntas simples, sin forzar profundidad.
              Ideal para recuperar estado interno y ver el automático.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6">
            <div className="text-sm font-semibold">Modo Profundo</div>
            <div className="mt-1 text-xs text-neutral-200/70">
              Conciencia · “Mirar más profundo”
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-100/80">
              Cuando aparece pena, miedo o confusión real. No da técnicas:
              acompaña el hilo emocional hasta que aparezca reposo.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6">
            <div className="text-sm font-semibold">Modo Contención</div>
            <div className="mt-1 text-xs text-neutral-200/70">Sendero · Alcohol</div>
            <p className="mt-3 text-sm leading-6 text-neutral-100/80">
              Para urgencia o impulso fuerte. Ventanas de 5–15 minutos,
              preguntas concretas, sostén y seguridad. Cierre:
              <span className="text-neutral-100"> “No estás solo con esto.”</span>
            </p>
          </div>
        </div>
      </section>

      {/* What KÜME is / isn't */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6">
            <h3 className="text-sm font-semibold">Qué sí es KÜME</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-100/80 leading-6">
              <li>• Un acompañante para recuperar presencia.</li>
              <li>• Un espejo amable: devuelve lo que escucha sin juicio.</li>
              <li>• Un puente: del automático a tu brújula interna.</li>
              <li>• Un sostén en momentos de impulso (alcohol).</li>
            </ul>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6">
            <h3 className="text-sm font-semibold">Qué nunca hará KÜME</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-100/80 leading-6">
              <li>• No te dirá qué hacer con tu vida.</li>
              <li>• No te diagnosticará ni hablará como clínico.</li>
              <li>• No te empujará a “sanar rápido”.</li>
              <li>• No reemplaza apoyo humano ni profesional.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/session"
            className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 hover:opacity-95 transition text-center"
          >
            Iniciar ahora
          </Link>

          <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md px-4 py-3 text-xs text-neutral-100/75 leading-5">
            Si hoy estás “bien”, entra igual. KÜME también sirve para sostener la
            calma y notar qué cambió.
          </div>
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
