import { HelpDialog } from '@/app/components/HelpDialog';
import { ImportDialog } from '@/app/components/ImportDialog';
import { useMobileNavigation } from '@/app/hooks/useMobileNavigation';
import { starterDecks } from '@/data/vocabulary';
import { canAccessPage } from '@/lib/auth';
import { DeckCollection } from '@/lib/decks/DeckCollection';
import { Check } from 'lucide-react';
import { useMemo } from 'react';
import type { WorkspaceProps } from './models';
import { navigationItems } from './navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useWorkspace } from './useWorkspace';
import { WorkspaceContent } from './WorkspaceContent';

/** Composes the workspace shell; pages and hooks own their individual concerns. */
export function Workspace({ role, state, setState, storageError, onSignIn, onSignOut }: WorkspaceProps) {
	const view = useWorkspace({ role, setState });
	const sidebarRef = useMobileNavigation(view.mobileOpen, view.setMobileOpen);
	const decks = useMemo(() => [...starterDecks, ...state.decks], [state.decks]);
	const myDeckCount = DeckCollection.mySets(decks, state.bookmarks).length;
	const resumeDeck = decks.find((deck) => deck.id === state.lastDeck) || starterDecks[0];
	const visiblePages = navigationItems
		.filter((item) => canAccessPage(role, item.id))
		.map((item) => ({
			...item,
			label: !view.isAdmin && item.id === 'library' ? 'Available sets' : item.label,
		}));
	return (
		<div className="app-shell">
			<a href="#main" className="skip-link">
				Skip to content
			</a>
			{view.mobileOpen && (
				<button className="sidebar-scrim" aria-label="Close navigation" onClick={() => view.setMobileOpen(false)} />
			)}
			<Sidebar
				sidebarRef={sidebarRef}
				mobileOpen={view.mobileOpen}
				page={view.page}
				visiblePages={visiblePages}
				myDeckCount={myDeckCount}
				resumeDeck={resumeDeck}
				onNavigate={view.navigate}
				onStudy={view.study}
				onClose={() => view.setMobileOpen(false)}
				onHelp={() => view.setHelpOpen(true)}
			/>
			<div className="main-shell">
				<Topbar
					mobileOpen={view.mobileOpen}
					activeDeck={view.activeDeck}
					pageLabel={visiblePages.find((item) => item.id === view.page)?.label}
					isAdmin={view.isAdmin}
					onOpenMenu={() => view.setMobileOpen(true)}
					onSignIn={onSignIn}
					onSignOut={onSignOut}
				/>
				<main id="main" className="main-content">
					{storageError && (
						<div className="error-box" role="alert">
							{view.isAdmin
								? 'Your browser could not save changes. Keep this tab open and download your sets from My sets before closing it.'
								: 'Your browser could not save your progress. Keep this tab open to continue learning.'}
						</div>
					)}
					<WorkspaceContent state={state} setState={setState} view={view} decks={decks} resumeDeck={resumeDeck} />
				</main>
			</div>
			{view.isAdmin && view.importOpen && (
				<ImportDialog onClose={() => view.setImportOpen(false)} onSave={view.saveDeck} />
			)}
			{view.helpOpen && <HelpDialog isAdmin={view.isAdmin} onClose={() => view.setHelpOpen(false)} />}
			{view.toast && (
				<div role="status" className="toast">
					<Check size={18} />
					{view.toast}
				</div>
			)}
		</div>
	);
}
