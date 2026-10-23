import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeState } from '../src/lib/storage.ts';
test('corrupt storage recovers to a usable blank state', () => {
	assert.deepEqual(decodeState('{oops').progress, {});
});
test('untrusted storage cannot inject invalid decks or progress', () => {
	const state = decodeState(
		JSON.stringify({
			decks: [{ id: 'bad', words: null }],
			bookmarks: [1, 'everyday'],
			progress: { good: 'known', bad: 'other' },
		})
	);
	assert.equal(state.decks.length, 0);
	assert.deepEqual(state.bookmarks, ['everyday']);
	assert.deepEqual(state.progress, { good: 'known' });
});
test('valid imported sets survive a roundtrip', () => {
	const deck = {
		id: 'custom-1',
		title: 'Test',
		description: 'My words',
		level: 'A1',
		topic: 'My vocabulary',
		color: 'purple',
		icon: 'book',
		custom: true,
		words: [{ id: 'w-1', english: 'hi', phonetic: '/haɪ/', vietnamese: 'chào' }],
	};
	assert.deepEqual(decodeState(JSON.stringify({ decks: [deck], progress: {}, bookmarks: [] })).decks, [deck]);
});
