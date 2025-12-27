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
      const role = typeof m?.role === "string" ? m.role : "user";
      const content = typeof m?.content === "string" ? m.content : "";
      return { role, content };
    })
    .filter((m) => m.content.trim().length > 0);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mode = coerceMode(body?.mode);
    const messages = coerceMessages(body?.messages);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Falta OPENAI_API_KEY en .env.local" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Si tu prompt ya incluye “modo urgencia/recaída” por instrucciones, puedes dejarlo igual.
    // Si quieres, más adelante lo hacemos condicional por mode.
    const instructions = ALCOHOL_PROMPT;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
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

    const text = String(response.output_text || "").trim() || "Te leo.";

    return NextResponse.json({ text });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error en sendero alcohol",
        detail: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}
