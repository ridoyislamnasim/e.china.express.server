export function ensureNullIfUndefined<T>(value: T | undefined | null | "undefined" | "null" | ""): T | null {
  return value === "undefined" || value === undefined || value === "" || value === "null" ? null : value;
}
