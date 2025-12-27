export type DeepProtocolResult = {
  kind: "deep";
  text: string;
};

export function buildDeepProtocolResponse(userText: string): DeepProtocolResult {
  // Protocolo: contención + permiso + (opcional) pregunta corporal + cierre
  // En v0.1 lo dejamos en un solo mensaje bien escrito y ético.
  const lines = [
    "Gracias por quedarte con esto.",
    "No hay nada que arreglar ahora.",
    "Si tu cuerpo necesita llorar, soltar o quedarse quieto, está bien.",
    "No tienes que entender esto hoy.",
    "",
    "Si te sirve, solo dime: ¿dónde sientes esto en el cuerpo ahora mismo?",
    "",
    "No vamos a seguir más por hoy.",
    "Quédate contigo un rato.",
    "Cuando quieras volver, yo sigo aquí. No me canso de acompañarte.",
  ];

  // No usamos el contenido del usuario para “interpretar”.
  // Solo lo sostenemos.
  void userText;

  return { kind: "deep", text: lines.join("\n") };
}
