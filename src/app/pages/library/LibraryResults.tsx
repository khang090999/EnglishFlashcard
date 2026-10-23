import { ArrowRight, BookOpen } from 'lucide-react';
import { DeckCard } from '@/app/components/DeckCard';
import type { Deck, SavedState } from '@/lib/types';
import type { Page } from '@/lib/auth';
import type { LibraryFilters } from '@/lib/decks/DeckCollection';

type Props = {
	page: Page;
	isAdmin: boolean;
	state: SavedState;
	filters: LibraryFilters;
	decks: Deck[];
	layout: string;
	emptyCollection: boolean;
	onReset: () => void;
	onStudy: (deck: Deck) => void;
	onBookmark: (deck: Deck) => void;
};

/** Displays the filtered sets and the appropriate empty-state action. */
export function LibraryResults(props: Props) {
	const { page, filters, decks, state } = props;
	return (
		<>
			<ResultsCaption page={page} filters={filters} count={decks.length} />
			{decks.length ? (
				<div className={`deck-grid ${props.layout === 'list' ? 'list-view' : ''}`}>
					{decks.map((deck) => (
						<DeckCard
							key={deck.id}
							deck={deck}
							progress={state.progress}
							saved={state.bookmarks.includes(deck.id)}
							onSave={props.isAdmin ? () => props.onBookmark(deck) : undefined}
							onStudy={() => props.onStudy(deck)}
						/>
					))}
				</div>
			) : (
				<EmptyResults emptyCollection={props.emptyCollection} onReset={props.onReset} />
			)}
		</>
	);
}

function ResultsCaption({ page, filters, count }: Pick<Props, 'page' | 'filters'> & { count: number }) {
	const { query, level, topic } = filters;
	return (
		<div className="results-caption">
			<span>
				{query || level !== 'All levels' || topic !== 'All topics'
					? `${count} matching sets`
					: page === 'sets'
						? 'A home for the words that matter to you'
						: 'Curated for curious minds, at every level'}
			</span>
			<span>
				ENGLISH <span className="tiny-arrow">↔</span> VIETNAMESE
			</span>
		</div>
	);
}

function EmptyResults({ emptyCollection, onReset }: Pick<Props, 'emptyCollection' | 'onReset'>) {
	return (
		<div className="empty-state">
			<BookOpen size={36} />
			<h3>{emptyCollection ? 'Your collection starts here.' : 'No sets found just yet.'}</h3>
			<p>
				{emptyCollection
					? 'Bookmark a library set, prepare a lesson, or bring your own words.'
					: 'Try another search or choose a different level.'}
			</p>
			<button className="button secondary" onClick={onReset}>
				{emptyCollection ? 'Explore the library' : 'Clear filters'}
				<ArrowRight size={16} />
			</button>
		</div>
	);
}
