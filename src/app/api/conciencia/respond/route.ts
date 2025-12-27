import { NextResponse } from "next/server";
import OpenAI from "openai";

import { CONCIENCIA_PROMPT } from "@/lib/kume/prompts/conciencia";
import { PROFUNDO_PROMPT } from "@/lib/kume/prompts/profundo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Mode = "daily" | "deep";

function coerceMode(v: unknown): Mode {
  return v === "deep" ? "deep" : "daily";
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

function countUserTurns(messages: Array<{ role: string; content: string }>) {
  return messages.filter((m) => m.role === "user").length;
}

// Heurística simple para invitar a profundo
function looksDeep(messages: Array<{ role: string; content: string }>) {
  const last = messages.slice(-2).map((m) => m.content.toLowerCase()).join(" ");
  return (
    /llor|lágrim|pena|miedo|vergüenza|infancia|agotad|no doy más|dolor|opresi|nudo|ansiedad|pánico|carencia|deuda/.test(
      last
    )
  );
}

// Cierres que “cierran” una sesión profunda
const DEEP_CLOSINGS = [
  "Lo dejamos aquí.",
  "Esto ya quedó nombrado.",
  "Por hoy, es suficiente.",
  "Quédate contigo un momento.",
  "No estás solo con esto.",
];

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

    const instructions = mode === "deep" ? PROFUNDO_PROMPT : CONCIENCIA_PROMPT;

    // ✅ Regla dura: en DAILY, después de 2 turnos del usuario, NO más interrogatorio.
    // Forzamos: reflejar + (invitar a profundo opcional) + cierre “Por hoy, es suficiente.”
    const userTurns = countUserTurns(messages);
    const dailyShouldCloseNow = mode === "daily" && userTurns >= 2;

    const controlNudge =
      mode === "daily"
        ? dailyShouldCloseNow
          ? `INSTRUCCIÓN DE SISTEMA (muy importante):
Ya hubo suficiente exploración para el modo Diario.
En esta respuesta:
- NO hagas más preguntas (a lo sumo 1 pregunta MUY corta si es estrictamente necesaria).
- Devuelve un reflejo humano (1–4 líneas),
- ofrece un gesto mínimo (1%),
- si se ve profundo, invita a "Mirar más profundo" en una sola frase opcional,
- y cierra con: "Por hoy, es suficiente."`
          : `INSTRUCCIÓN DE SISTEMA (modo Diario):
Responde como compañero (espejo amable), y haz como máximo 1 pregunta.`
        : `INSTRUCCIÓN DE SISTEMA (modo Profundo):
Sostén el hilo emocional; evita técnicas y evita excesivas preguntas.`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions,
      input: [
        { role: "system", content: controlNudge },
        ...messages.map((m) => ({
          role: m.role as any,
          content: m.content,
        })),
      ],
    });

    let text = String(response.output_text || "").trim();
    if (!text) text = "Te leo.\n\nDime una frase más.";

    // ✅ suggestDeep: para que tu UI muestre la tarjeta “Mirar más profundo”
    const suggestDeep = mode === "daily" && looksDeep(messages);

    const tail = text.slice(-250);
    const questionNearEnd = tail.includes("?");

    const deepClosed =
      mode === "deep" && DEEP_CLOSINGS.some((k) => text.includes(k));

    const done = deepClosed && !questionNearEnd;

    return NextResponse.json({ text, done, mode, suggestDeep });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error en conciencia/profundo",
        detail: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}
