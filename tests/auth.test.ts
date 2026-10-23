import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authenticateAdmin, canAccessPage } from '../src/lib/auth.ts';

test('only the exact admin credentials grant admin access', () => {
	assert.equal(authenticateAdmin('admin', 'admin'), 'admin');
	for (const [username, password] of [
		['', ''],
		['admin', ''],
		['admin', 'wrong'],
		['student', 'admin'],
		['Admin', 'admin'],
		['admin', 'admin '],
	]) {
		assert.equal(authenticateAdmin(username, password), null);
	}
});

test('students can access available sets but no management or progress pages', () => {
	assert.equal(canAccessPage('student', 'library'), true);
	for (const page of ['sets', 'prepare', 'progress'] as const) {
		assert.equal(canAccessPage('student', page), false);
	}
});

test('admins retain access to every existing page', () => {
	for (const page of ['library', 'sets', 'prepare', 'progress'] as const) {
		assert.equal(canAccessPage('admin', page), true);
	}
});
