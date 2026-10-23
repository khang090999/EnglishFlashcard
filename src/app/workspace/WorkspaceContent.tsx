import { Prepare } from '@/app/components/Prepare';
import { Study } from '@/app/components/Study';
import { LibraryPage } from '@/app/pages/library/LibraryPage';
import { ProgressPage } from '@/app/pages/progress/ProgressPage';
import type { Deck } from '@/lib/types';
import type { WorkspaceProps } from './models';
import type { WorkspaceView } from './useWorkspace';

type Props = Pick<WorkspaceProps, 'state' | 'setState'> & { view: WorkspaceView; decks: Deck[]; resumeDeck: Deck };

/** Selects the current page while retaining the original role guards. */
export function WorkspaceContent({ state, setState, view, decks, resumeDeck }: Props) {
	if (view.activeDeck) {
		return (
			<Study
				key={view.activeDeck.id}
				deck={view.activeDeck}
				progress={state.progress}
				onGrade={(id, grade) => setState((current) => ({ ...current, progress: { ...current.progress, [id]: grade } }))}
				onBack={() => view.setActiveDeck(null)}
			/>
		);
	}
	if (view.isAdmin && view.page === 'prepare') {
		return <Prepare onSave={view.saveDeck} />;
	}
	if (view.isAdmin && view.page === 'progress') {
		return <ProgressPage decks={decks} state={state} onStudy={view.study} onBookmark={view.bookmark} />;
	}
	return (
		<LibraryPage
			page={view.page}
			isAdmin={view.isAdmin}
			decks={decks}
			state={state}
			resumeDeck={resumeDeck}
			filters={view.filters}
			layout={view.layout}
			onFilterChange={view.updateFilters}
			onLayoutChange={view.setLayout}
			onStudy={view.study}
			onBookmark={view.bookmark}
			onNavigate={view.navigate}
			onImport={() => view.setImportOpen(true)}
		/>
	);
}
