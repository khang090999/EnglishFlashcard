// These IDs identify browser-local sets; they are not authentication tokens.
let counter = 0;
export function createDeckId(source?: { randomUUID?: () => string }): string {
  return `custom-${source?.randomUUID ? source.randomUUID() : `${Date.now().toString(36)}-${(++counter).toString(36)}-${Math.random().toString(36).slice(2, 10)}`}`;
}
