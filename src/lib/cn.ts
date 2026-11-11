/** Minimal class joiner — no dependency needed for this project's scale. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
