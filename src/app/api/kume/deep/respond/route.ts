import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { KUMEN_DEEP_MODE_INSTRUCTIONS } from "@/lib/kumen/deepPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MsgSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const BodySchema = z.object({
  dayQuestionText: z.string().min(1),
  messages: z.array(MsgSchema).min(1),
  turnCount: z.number().int().min(0).max(50).optional().default(0),
});

function shouldForceClose(turnCount: number) {
  // Máximo ~6 respuestas de Kümen en modo profundo
  return turnCount >= 6;
}

// Fallback profundo (si OpenAI falla): no técnica, no motivación, orden de sentido + cierre.
function localDeepFallback(userLast: string) {
  const t = (userLast || "").trim();
  if (!t) {
    return "No sigamos más hoy.\nEsto ya quedó nombrado.";
  }

  // Respuesta canónica para casos como el tuyo (técnicas vs presencia / dolor)
  if (
    /medit|respir|visualiz|mantra|tarea|ejerc/i.test(t) &&
    /dolor|consciente|me di cuenta|me hizo/i.test(t)
  ) {
    return [
      "No te movió la falta de técnicas.",
      "",
      "Te movió darte cuenta de que el dolor ya estaba ahí,",
      "y que no necesitaba ser empujado para aparecer.",
      "",
      "No es que Kümen no haga nada.",
      "Es que por primera vez no te pidió huir.",
      "",
      "No sigamos más hoy.",
      "Esto ya quedó nombrado.",
    ].join("\n");
  }

  return [
    "Lo que dijiste no necesita más explicación.",
    "",
    "Se siente como un punto bisagra:",
    "algo se ordenó al nombrarlo.",
    "",
    "No sigamos más hoy.",
    "Esto ya quedó nombrado.",
  ].join("\n");
}

export async function POST(req: Request) {
  const startedAt = Date.now();

  try {
    const body = BodySchema.parse(await req.json());

    if (shouldForceClose(body.turnCount)) {
      return NextResponse.json({
        text: "No sigamos más hoy.\nEsto ya quedó nombrado.",
        done: true,
        meta: { source: "limit" },
      });
    }

    // Último mensaje del usuario (para fallback local o para focalizar)
    const lastUser = [...body.messages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Si no hay API key, no reventamos: respondemos fallback profundo
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        text: localDeepFallback(lastUser),
        done: true,
        meta: { source: "no_api_key" },
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const transcript = body.messages
      .map((m) => `${m.role === "user" ? "Usuario" : "Kümen"}: ${m.content}`)
      .join("\n");

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: KUMEN_DEEP_MODE_INSTRUCTIONS,
      input: [
        "Contexto del día:",
        `Pregunta del día: ${body.dayQuestionText}`,
        "",
        "Conversación hasta ahora:",
        transcript,
        "",
        "Instrucción:",
        "Responde como Kümen en Modo Acompañamiento Profundo.",
        "Pocas frases. Precisión. Sin técnicas.",
        "Si haces una pregunta, que sea UNA y orientada al sentido.",
        "Si ya quedó nombrado, cierra con: 'No sigamos más hoy. Esto ya quedó nombrado.'",
      ].join("\n"),
    });

    // Extracción robusta del texto
    const text =
      response.output_text?.trim() ||
      // @ts-ignore: compat
      response.output?.[0]?.content?.[0]?.text?.trim() ||
      "";

    // Si vino vacío, no botamos: devolvemos cierre digno
    if (!text) {
      return NextResponse.json({
        text: localDeepFallback(lastUser),
        done: true,
        meta: { source: "empty_model_text" },
      });
    }

    return NextResponse.json({
      text,
      done: false,
      meta: { source: "openai", ms: Date.now() - startedAt },
    });
  } catch (err: any) {
    // IMPORTANTÍSIMO: NO devolvemos 500 para que el front no caiga al catch
    const detail = err?.message ?? String(err);
    console.error("[kumen deep] error:", detail);

    return NextResponse.json({
      text: "No sigamos más hoy.\nEsto ya quedó nombrado.",
      done: true,
      meta: { source: "exception", detail },
    });
  }
}
