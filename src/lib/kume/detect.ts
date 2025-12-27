export type KumenMode = "A" | "B" | "C";

const DEEP_MARKERS = [
  "llor",
  "lágr",
  "pena",
  "me quebr",
  "me remov",
  "me dol",
  "infancia",
  "desde chico",
  "desde niño",
  "no soy suficiente",
  "me dio miedo",
  "pánico",
  "vacío",
  "me dejó mal",
];

const VULNERABLE_MARKERS = [
  "me cuesta",
  "no sé",
  "agot",
  "cans",
  "ansiedad",
  "carencia",
  "me preocupa",
  "me da miedo",
  "me siento mal",
  "me siento solo",
  "culpa",
  "vergüenza",
];

export function detectMode(userText: string): KumenMode {
  const t = (userText || "").toLowerCase().trim();

  if (!t) return "B"; // vacío = vulnerabilidad suave

  const deepHit = DEEP_MARKERS.some((m) => t.includes(m));
  if (deepHit) return "C";

  const vulnerableHit = VULNERABLE_MARKERS.some((m) => t.includes(m));
  if (vulnerableHit) return "B";

  return "A";
}
