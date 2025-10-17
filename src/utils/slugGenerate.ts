export function slugGenerate(name: string): string {
  return name.trim().replace(/\s+/g, "-").toLowerCase();
}
