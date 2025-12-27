export type KumenQuestion = {
  id: string;
  text: string;
};

export const KUMEN_QUESTIONS: KumenQuestion[] = [
  { id: "q1", text: "¿Qué parte de tu día hoy se sintió más pesada de sostener?" },
  { id: "q2", text: "¿En qué momento hoy notaste que reaccionaste en automático?" },
  { id: "q3", text: "¿Qué estabas intentando evitar sentir cuando hiciste eso?" },
  { id: "q4", text: "¿Dónde pusiste hoy tu energía sin darte cuenta?" },
  { id: "q5", text: "¿Qué pensamiento se repitió más hoy en tu mente?" },
  { id: "q6", text: "¿Qué parte de ti estuvo intentando protegerte hoy?" },
  { id: "q7", text: "¿Qué emoción estuvo más presente en tu cuerpo hoy, aunque no la hayas nombrado?" },
  { id: "q8", text: "¿Qué hiciste hoy que fue un poco más consciente que antes?" },
  { id: "q9", text: "Si hoy no te juzgaras, ¿qué verías con más claridad sobre ti?" },
  { id: "q10", text: "¿Qué necesitarías ahora mismo para estar un poco más en paz?" },
];

export const KUME_START_KEY = "kume_start_date_iso";

// Helpers (usamos YYYY-MM-DD en local)
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: Date, b: Date) {
  const a0 = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const b0 = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  const ms = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.floor((b0 - a0) / ms));
}

/**
 * Obtiene (o crea) la fecha de inicio del usuario.
 * Esa fecha define el "Día 1".
 */
export function getOrCreateStartDateISO(today = new Date()): string {
  if (typeof window === "undefined") return toISODate(today);
  const existing = window.localStorage.getItem(KUME_START_KEY);
  if (existing) return existing;
  const created = toISODate(today);
  window.localStorage.setItem(KUME_START_KEY, created);
  return created;
}

/**
 * Día 1 = q1, Día 2 = q2, etc. basado en startDate.
 * SIEMPRE devuelve un objeto {id, text}.
 */
export function pickDailyQuestionFromStartDate(
  startDateISO: string,
  today = new Date()
): KumenQuestion {
  const [y, m, d] = startDateISO.split("-").map(Number);
  const start = new Date(y, (m ?? 1) - 1, d ?? 1);
  const delta = daysBetween(start, today);
  const idx = delta % KUMEN_QUESTIONS.length;
  return KUMEN_QUESTIONS[idx];
}

export function resetKumeStartDate(today = new Date()) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KUME_START_KEY, toISODate(today));
}
