import { NextResponse } from "next/server";
import OpenAI from "openai";

import { CONCIENCIA_PROMPT } from "@/lib/kume/prompts/conciencia";
import { PROFUNDO_PROMPT } from "@/lib/kume/prompts/profundo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Mode = "daily" | "deep";

function coerceMode(v: unknown): Mode {
  if (v === "deep") return "deep";
  return "daily";
}

function coerceMessages(v: unknown): Array<{ role: string; content: string }> {
  if (!Array.isArray(v)) return [];
  return v
    .map((m) => {
      const role = typeof m?.role === "string" ? m.role : "user";
      const content = typeof m?.content === "string" ? m.content : "";
      return { role, content };
    })
    .filter((m) => m.content.trim().length > 0);
}

/**
 * Regla:
 * - Si hay una pregunta o una invitación a profundizar,
 *   NO se permite el cierre en el mismo mensaje.
 */
function stripPrematureClosure(text: string): string {
  if (!text) return text;

  const normalized = text.replace(/\u00A0/g, " ");
  const closureRegex = /Por hoy,\s*es\s*suficiente\./i;
  const match = closureRegex.exec(normalized);
  if (!match || match.index == null) return text;

  const before = normalized.slice(0, match.index);

  const hasQuestion =
    before.includes("?") || before.includes("¿");

  const invitesDeep =
    /más profundo|quedarnos un poco más|mirar más/i.test(before);

  if (!hasQuestion && !invitesDeep) return text;

  return before.trim().replace(/\n{3,}$/g, "\n\n").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mode = coerceMode(body?.mode);
    const messages = coerceMessages(body?.messages);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Falta OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const instructions =
      mode === "deep" ? PROFUNDO_PROMPT : CONCIENCIA_PROMPT;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions,
      input: messages.map((m) => ({
        role: m.role as any,
        content: m.content,
      })),
    });

    const raw = String(response.output_text || "").trim() || "Te leo.";

    const text = stripPrematureClosure(raw);

    return NextResponse.json({ text });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error en sendero conciencia",
        detail: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}
