import { NextResponse } from "next/server";
import OpenAI from "openai";

import { ALCOHOL_PROMPT } from "@/lib/kume/prompts/alcohol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Mode = "daily" | "urgent" | "relapse";

function coerceMode(v: unknown): Mode {
  if (v === "urgent") return "urgent";
  if (v === "relapse") return "relapse";
  return "daily";
}

function coerceMessages(v: unknown): Array<{ role: string; content: string }> {
  if (!Array.isArray(v)) return [];
  return v
    .map((m) => {
      const role = typeof (m as any)?.role === "string" ? (m as any).role : "user";
      const content = typeof (m as any)?.content === "string" ? (m as any).content : "";
      return { role, content };
    })
    .filter((m) => m.content.trim().length > 0);
}

/**
 * Evita el bug: el modelo hace una pregunta y se despide en el mismo turno.
 *
 * Regla: si hay una pregunta ANTES del cierre, removemos el cierre (y todo lo que venga después).
 * Soporta variaciones: espacios, saltos, NBSP, etc.
 */
function stripPrematureClosure(text: string): string {
  if (!text) return text;

  // Normalizamos NBSP -> espacio
  const normalized = text.replace(/\u00A0/g, " ");

  // Detecta "Por hoy, es suficiente." aunque haya espacios raros
  const closureRegex = /Por hoy,\s*es\s*suficiente\./i;
  const match = closureRegex.exec(normalized);
  if (!match || match.index == null) return text;

  const idx = match.index;
  const before = normalized.slice(0, idx);

  // Si antes del cierre hay una pregunta, el cierre es prematuro
  const hasQuestion = before.includes("?") || before.includes("¿");
  if (!hasQuestion) return text;

  const cleaned = before.trimEnd();

  // Limpia exceso de saltos
  return cleaned.replace(/\n{3,}$/g, "\n\n").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mode = coerceMode(body?.mode);
    const messages = coerceMessages(body?.messages);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          text: "Falta OPENAI_API_KEY en variables de entorno.",
          meta: { build: process.env.VERCEL_GIT_COMMIT_SHA || "unknown" },
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const instructions = ALCOHOL_PROMPT;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions,
      input: [
        {
          role: "user",
          content:
            mode === "urgent"
              ? "Modo: URGENCIA (10 minutos). Contén y reduce riesgo inmediato."
              : mode === "relapse"
              ? "Modo: RECAÍDA. Contén sin juicio y orienta a seguridad."
              : "Modo: DIARIO.",
        },
        ...messages.map((m) => ({
          role: m.role as any,
          content: m.content,
        })),
      ],
    });

    const raw = String(response.output_text || "").trim() || "Te leo.";

    // ✅ La corrección
    const text = stripPrematureClosure(raw);

    return NextResponse.json({
      text,
      meta: {
        build: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
        env: process.env.VERCEL_ENV || "unknown",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error en sendero alcohol",
        detail: String(error?.message || error),
        meta: { build: process.env.VERCEL_GIT_COMMIT_SHA || "unknown" },
      },
      { status: 500 }
    );
  }
}
