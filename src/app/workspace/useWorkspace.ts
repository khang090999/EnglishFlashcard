import { useToast } from '@/app/hooks/useToast';
import { canAccessPage, type Page } from '@/lib/auth';
import type { LibraryFilters } from '@/lib/decks/DeckCollection';
import type { Deck } from '@/lib/types';
import { useState } from 'react';
import type { WorkspaceProps } from './models';

const emptyFilters: LibraryFilters = { query: '', level: 'All levels', topic: 'All topics', tab: 'all' };

/** Owns navigation and view state so returning from study preserves library filters. */
export function useWorkspace({ role, setState }: Pick<WorkspaceProps, 'role' | 'setState'>) {
	const isAdmin = role === 'admin';
	const [requestedPage, setPage] = useState<Page>('library');
	const page = canAccessPage(role, requestedPage) ? requestedPage : 'library';
	const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
	const [filters, setFilters] = useState<LibraryFilters>(emptyFilters);
	const [layout, setLayout] = useState('grid');
	const [importOpen, setImportOpen] = useState(false);
	const [helpOpen, setHelpOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const { toast, setToast } = useToast();

	function updateFilters(change: Partial<LibraryFilters>) {
		setFilters((current) => ({ ...current, ...change }));
	}
	function navigate(next: Page) {
		if (!canAccessPage(role, next)) {
			return;
		}
		setPage(next);
		setActiveDeck(null);
		setFilters((current) => ({ ...emptyFilters, tab: current.tab }));
		setMobileOpen(false);
		window.scrollTo({ top: 0 });
	}
	function study(deck: Deck) {
		setActiveDeck(deck);
		setState((current) => ({ ...current, lastDeck: deck.id }));
		window.scrollTo({ top: 0 });
	}
	function saveDeck(deck: Deck) {
		if (!isAdmin) {
			return;
		}
		setState((current) => ({ ...current, decks: [...current.decks, deck] }));
		setImportOpen(false);
		navigate('sets');
		updateFilters({ tab: 'all' });
		setToast(`“${deck.title}” is ready to study.`);
	}
	function bookmark(deck: Deck) {
		if (!isAdmin) {
			return;
		}
		setState((current) => ({
			...current,
			bookmarks: current.bookmarks.includes(deck.id)
				? current.bookmarks.filter((id) => id !== deck.id)
				: [...current.bookmarks, deck.id],
		}));
	}
	return {
		page,
		isAdmin,
		activeDeck,
		setActiveDeck,
		filters,
		updateFilters,
		layout,
		setLayout,
		importOpen,
		setImportOpen,
		helpOpen,
		setHelpOpen,
		mobileOpen,
		setMobileOpen,
		toast,
		navigate,
		study,
		saveDeck,
		bookmark,
	};
}

export type WorkspaceView = ReturnType<typeof useWorkspace>;
