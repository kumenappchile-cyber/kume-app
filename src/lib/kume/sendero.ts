export type Sendero = "conciencia" | "alcohol";

const KEY = "kume_sendero_today";
// Compat por si quedaron llaves viejas de versiones anteriores
const LEGACY_KEYS = ["sendero_today", "kumen_sendero_today", "kumen_sendero"];

function isSendero(v: unknown): v is Sendero {
  return v === "conciencia" || v === "alcohol";
}

/**
 * Lee el sendero elegido "para hoy".
 * Importante: si no existe, devuelve null (NO elige por ti).
 */
export function getSenderoToday(): Sendero | null {
  if (typeof window === "undefined") return null;

  // 1) Nueva key
  const current = window.localStorage.getItem(KEY);
  if (isSendero(current)) return current;

  // 2) Buscar en keys antiguas (migración)
  for (const k of LEGACY_KEYS) {
    const legacy = window.localStorage.getItem(k);
    if (isSendero(legacy)) {
      window.localStorage.setItem(KEY, legacy);
      // opcional: limpiar la antigua
      // window.localStorage.removeItem(k);
      return legacy;
    }
  }

  return null;
}

export function setSenderoToday(sendero: Sendero) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, sendero);
}

export function clearSenderoToday() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  for (const k of LEGACY_KEYS) window.localStorage.removeItem(k);
}
