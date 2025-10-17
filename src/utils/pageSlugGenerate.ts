export function pageSlugGenerate(name: string): string {
  return name.toLowerCase().replace(/ /g, '-');
}
