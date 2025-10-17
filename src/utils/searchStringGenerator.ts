// Utility to generate a search string (slug) from a given string
export function searchStringGenerator(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '')     // Trim hyphens from start/end
    .replace(/--+/g, '-');       // Replace multiple hyphens with one
}
