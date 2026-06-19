export const normalizeNullable = <T extends Record<string, unknown>>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value === null ? undefined : value])
  ) as unknown as T;
};
