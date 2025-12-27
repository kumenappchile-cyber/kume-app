export type KumeQuestion = {
  id: string;
  text: string;
};

export const KUME_QUESTIONS: KumeQuestion[] = [
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

// Keys
export const KUME_START_KEY = "kume_start_date_iso";

// Compat: si venías usando la key antigua, la migramos sin perder el día.
const LEGACY_KUMEN_START_KEY = "kumen_start_date_iso";

// Helpers (sin problemas raros de timezone): usamos YYYY-MM-DD
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: Date, b: Date) {
  // Comparamos solo por fecha (medianoche local)
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
  if (typeof window === "undefined") return toISODate(today); // fallback SSR

  // Migración desde key antigua (si existe)
  const legacy = window.localStorage.getItem(LEGACY_KUMEN_START_KEY);
  const current = window.localStorage.getItem(KUME_START_KEY);

  if (current) return current;

  if (legacy) {
    window.localStorage.setItem(KUME_START_KEY, legacy);
    return legacy;
  }

  const created = toISODate(today);
  window.localStorage.setItem(KUME_START_KEY, created);
  return created;
}

/**
 * Día 1 = q1, Día 2 = q2, etc. basado en startDate.
 * Devuelve SOLO el texto (string) para usar directo en UI.
 */
export function pickDailyQuestionFromStartDate(startDateISO: string, today = new Date()): string {
  const q = pickDailyQuestionObjectFromStartDate(startDateISO, today);
  return q.text;
}

/**
 * Variante (opcional): devuelve el objeto completo {id, text}.
 */
export function pickDailyQuestionObjectFromStartDate(
  startDateISO: string,
  today = new Date()
): KumeQuestion {
  const [y, m, d] = startDateISO.split("-").map(Number);
  const start = new Date(y, (m ?? 1) - 1, d ?? 1);
  const delta = daysBetween(start, today);
  const idx = delta % KUME_QUESTIONS.length;
  return KUME_QUESTIONS[idx];
}

/**
 * Reset opcional (por si luego quieres un botón en UI).
 */
export function resetKumeStartDate(today = new Date()) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KUME_START_KEY, toISODate(today));
}
