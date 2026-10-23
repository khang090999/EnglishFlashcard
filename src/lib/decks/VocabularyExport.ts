import type { Deck } from '../types';

/** Serializes the vocabulary columns supported by the import dialog. */
export class VocabularyExport {
	/** Produces UTF-8 CSV with a BOM for spreadsheet applications. */
	static toCsv(decks: Deck[]) {
		const rows = decks
			.flatMap((deck) => deck.words)
			.map((word) => {
				return [word.english, word.phonetic, word.vietnamese]
					.map((cell) => `"${cell.replaceAll('"', '""')}"`)
					.join(',');
			});
		return '\uFEFFenglish,phonetic,vietnamese\n' + rows.join('\n');
	}

	/** Downloads custom vocabulary and releases the temporary browser URL. */
	static download(decks: Deck[]) {
		const blob = new Blob([this.toCsv(decks)], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		try {
			const link = document.createElement('a');
			link.href = url;
			link.download = 'lexi-my-vocabulary.csv';
			link.click();
		} finally {
			URL.revokeObjectURL(url);
		}
	}
}
