import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { detectMode } from "@/lib/kumen/detect";
import { buildKumenOutput } from "@/lib/kumen/prompt";

const BodySchema = z.object({
  questionId: z.string().min(1),
  questionText: z.string().min(1),
  userText: z.string().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const body = BodySchema.parse(await req.json());

    const mode = detectMode(body.userText);

    // En v0.1 podemos generar local (sin modelo) o con modelo.
    // Aquí lo hacemos híbrido:
    // - Modo C: respuesta local (protocolo) para máxima seguridad y consistencia.
    // - Modo A/B: usamos el modelo para pulir tono SIN romper reglas.
    if (mode === "C") {
      const out = buildKumenOutput({
        questionId: body.questionId,
        questionText: body.questionText,
        userText: body.userText,
        mode,
      });
      return NextResponse.json({ mode, text: out.text });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const safetyRules = `
Eres Kümen: compañero incansable hacia una vida consciente.
Reglas:
- No des consejos directos ni planes.
- No digas "entiendo".
- No uses "aprendizaje", "mensaje", "lección", "todo pasa por algo".
- No pidas respiración, visualización ni afirmaciones.
- Refleja con dignidad y suavidad.
- Responde en español, frases cortas, tono humano.
    `.trim();

    const localDraft = buildKumenOutput({
      questionId: body.questionId,
      questionText: body.questionText,
      userText: body.userText,
      mode,
    }).text;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: safetyRules,
      input: [
        "Contexto del día:",
        `Pregunta: ${body.questionText}`,
        `Respuesta del usuario: ${body.userText || "(vacío)"}`,
        "",
        "Borrador base (mantén el sentido, mejora fluidez sin romper reglas):",
        localDraft,
      ].join("\n"),
    });

    const text = response.output_text?.trim() || localDraft;

    return NextResponse.json({ mode, text });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Kumen API error", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}