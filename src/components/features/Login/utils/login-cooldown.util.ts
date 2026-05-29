export const COOLDOWN_SECONDS = 90;
export const RATE_LIMIT_COOLDOWN_SECONDS = 120;
const STORAGE_KEY = 'reviuy-login-cooldown';

export const getPersistedCooldown = (): number => {
  if (!globalThis.window) return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const remaining = Number.parseInt(raw, 10) - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  } catch {
    return 0;
  }
};

export const persistCooldown = (durationMs: number) => {
  if (!globalThis.window) return;
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + durationMs));
  } catch {
    // localStorage puede fallar (privacidad, cuota)
  }
};

export const clearPersistedCooldown = () => {
  if (!globalThis.window) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silencio
  }
};
