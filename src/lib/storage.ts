import type { Deck, SavedState, Word } from "./types";
export const STORAGE_KEY = "lexi-vocabulary-v1";
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const validWord = (w: unknown): w is Word =>
  isRecord(w) &&
  typeof w.id === "string" &&
  typeof w.english === "string" &&
  !!w.english.trim() &&
  typeof w.phonetic === "string" &&
  typeof w.vietnamese === "string" &&
  !!w.vietnamese.trim() &&
  (w.example === undefined || typeof w.example === "string");
const validDeck = (d: unknown): d is Deck =>
  isRecord(d) &&
  ["id", "title", "description", "topic", "color", "icon"].every(
    (k) => typeof d[k] === "string",
  ) &&
  ["A1", "A2", "B1", "B2", "C1", "C2"].includes(d.level as string) &&
  Array.isArray(d.words) &&
  d.words.length > 0 &&
  d.words.length <= 1000 &&
  d.words.every(validWord) &&
  new Set(d.words.map((w) => w.id)).size === d.words.length &&
  d.custom === true;
export function decodeState(raw: string | null): SavedState {
  const blank: SavedState = { decks: [], bookmarks: [], progress: {} };
  try {
    const value: unknown = JSON.parse(raw || "{}");
    if (!isRecord(value)) return blank;
    const decks = Array.isArray(value.decks)
      ? value.decks.filter(validDeck)
      : [];
    return {
      decks: decks.filter(
        (d, i) => decks.findIndex((other) => other.id === d.id) === i,
      ),
      bookmarks: Array.isArray(value.bookmarks)
        ? value.bookmarks.filter((v): v is string => typeof v === "string")
        : [],
      progress: isRecord(value.progress)
        ? Object.fromEntries(
            Object.entries(value.progress).filter(
              (entry): entry is [string, "known" | "review"] =>
                entry[1] === "known" || entry[1] === "review",
            ),
          )
        : {},
      lastDeck: typeof value.lastDeck === "string" ? value.lastDeck : undefined,
    };
  } catch {
    return blank;
  }
}
