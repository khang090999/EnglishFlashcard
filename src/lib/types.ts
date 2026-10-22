export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type Level = (typeof LEVELS)[number];
export type Word = {
  id: string;
  english: string;
  phonetic: string;
  vietnamese: string;
  example?: string;
};
export type Deck = {
  id: string;
  title: string;
  description: string;
  level: Level;
  topic: string;
  color: string;
  icon: string;
  words: Word[];
  custom?: boolean;
};
export type Progress = Record<string, "known" | "review">;
export type SavedState = {
  decks: Deck[];
  bookmarks: string[];
  progress: Progress;
  lastDeck?: string;
};
