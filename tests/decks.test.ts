import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DeckCollection } from '../src/lib/decks/DeckCollection.ts';
import { VocabularyExport } from '../src/lib/decks/VocabularyExport.ts';
import { parseVocabulary } from '../src/lib/import.ts';
import type { Deck } from '../src/lib/types.ts';

const starter: Deck = {
	id: 'starter',
	title: 'First words',
	description: 'Everyday language',
	level: 'A1',
	topic: 'Daily life',
	color: 'green',
	icon: 'book',
	words: [{ id: 'shared', english: 'hello', phonetic: '/həˈləʊ/', vietnamese: 'xin chào' }],
};
const custom: Deck = { ...starter, id: 'custom', title: 'My lesson', level: 'A2', custom: true };
const filters = { query: '', level: 'All levels', topic: 'All topics', tab: 'all' as const };

test('library search combines Vietnamese, level, and topic filters without mutating decks', () => {
	const decks = [starter, custom];
	assert.deepEqual(DeckCollection.filter(decks, { ...filters, query: 'CHÀO', level: 'A2' }, []), [custom]);
	assert.deepEqual(DeckCollection.filter(decks, { ...filters, topic: 'Travel' }, []), []);
	assert.deepEqual(decks, [starter, custom]);
});

test('my sets includes created and bookmarked decks and applies the selected tab', () => {
	const decks = DeckCollection.mySets([starter, custom], ['starter']);
	assert.deepEqual(decks, [starter, custom]);
	assert.deepEqual(DeckCollection.filter(decks, { ...filters, tab: 'created' }, ['starter']), [custom]);
	assert.deepEqual(DeckCollection.filter(decks, { ...filters, tab: 'saved' }, ['starter']), [starter]);
});

test('shared vocabulary counts once in progress and keeps the last occurrence', () => {
	const updated = { ...starter.words[0], vietnamese: 'chào' };
	assert.deepEqual(DeckCollection.uniqueWords([starter, { ...custom, words: [updated] }]), [updated]);
});

test('CSV export preserves quotes, commas, newlines, and Vietnamese through import', () => {
	const words = [{ id: 'quoted', english: 'say "hello"', phonetic: '', vietnamese: 'chào, bạn\nthân' }];
	const csv = VocabularyExport.toCsv([{ ...custom, words }]);
	assert.ok(csv.startsWith('\uFEFFenglish,phonetic,vietnamese\n'));
	assert.deepEqual(parseVocabulary(csv).words, [
		{ english: 'say "hello"', phonetic: '', vietnamese: 'chào, bạn\nthân' },
	]);
	assert.deepEqual(parseVocabulary(csv).errors, []);
});
