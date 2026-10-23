import type { Deck } from '../types';

export type LibraryFilters = {
	query: string;
	level: string;
	topic: string;
	tab: 'all' | 'created' | 'saved';
};

/** Queries vocabulary sets without modifying the saved collection. */
export class DeckCollection {
	/** Includes both locally created sets and bookmarked starter sets. */
	static mySets(decks: Deck[], bookmarks: string[]) {
		return decks.filter((deck) => deck.custom || bookmarks.includes(deck.id));
	}

	/** Counts shared source words once, preserving the most recent word details. */
	static uniqueWords(decks: Deck[]) {
		const words = decks.flatMap((deck) => deck.words);
		return [...new Map(words.map((word) => [word.id, word])).values()];
	}

	/** Applies all active filters, including case-insensitive bilingual search. */
	static filter(decks: Deck[], filters: LibraryFilters, bookmarks: string[]) {
		const query = filters.query.toLocaleLowerCase();
		return decks.filter((deck) => {
			if (filters.level !== 'All levels' && deck.level !== filters.level) {
				return false;
			}
			if (filters.topic !== 'All topics' && deck.topic !== filters.topic) {
				return false;
			}
			if (filters.tab === 'created' && !deck.custom) {
				return false;
			}
			if (filters.tab === 'saved' && !bookmarks.includes(deck.id)) {
				return false;
			}
			const vocabulary = deck.words.map((word) => `${word.english} ${word.vietnamese}`).join(' ');
			const searchableText = `${deck.title} ${deck.description} ${deck.topic} ${vocabulary}`;
			return searchableText.toLocaleLowerCase().includes(query);
		});
	}
}
