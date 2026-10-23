import { ArrowRight, GraduationCap, Leaf, Monitor, Plus, Upload } from 'lucide-react';
import type { Page } from '@/lib/auth';
import { DeckCollection, type LibraryFilters as FilterValues } from '@/lib/decks/DeckCollection';
import { VocabularyExport } from '@/lib/decks/VocabularyExport';
import type { Deck, SavedState } from '@/lib/types';
import { LibraryFilters } from './LibraryFilters';
import { LibraryHero } from './LibraryHero';
import { LibraryResults } from './LibraryResults';

type Props = {
	page: Page;
	isAdmin: boolean;
	decks: Deck[];
	state: SavedState;
	resumeDeck: Deck;
	filters: FilterValues;
	layout: string;
	onFilterChange: (change: Partial<FilterValues>) => void;
	onLayoutChange: (layout: string) => void;
	onStudy: (deck: Deck) => void;
	onBookmark: (deck: Deck) => void;
	onNavigate: (page: Page) => void;
	onImport: () => void;
};

/** Composes the library and personal-set pages while keeping filters in workspace state. */
export function LibraryPage(props: Props) {
	return (
		<>
			<LibraryHeading page={props.page} isAdmin={props.isAdmin} onImport={props.onImport} />
			{props.page === 'library' && (
				<LibraryHero resumeDeck={props.resumeDeck} hasLastDeck={!!props.state.lastDeck} onStudy={props.onStudy} />
			)}
			<LibrarySection {...props} />
			<LibraryFooter page={props.page} isAdmin={props.isAdmin} onNavigate={props.onNavigate} />
		</>
	);
}

function LibrarySection(props: Props) {
	const { page, decks, state, filters } = props;
	const myDecks = DeckCollection.mySets(decks, state.bookmarks);
	const sourceDecks = page === 'sets' ? myDecks : decks;
	const filtered = DeckCollection.filter(
		sourceDecks,
		{ ...filters, tab: page === 'sets' ? filters.tab : 'all' },
		state.bookmarks
	);
	const emptyCollection = page === 'sets' && !myDecks.length;
	function resetResults() {
		if (emptyCollection) {
			props.onNavigate('library');
		} else {
			props.onFilterChange({ query: '', level: 'All levels', topic: 'All topics', tab: 'all' });
		}
	}
	return (
		<section className="library-section">
			<LibraryToolbar
				page={page}
				isAdmin={props.isAdmin}
				state={state}
				count={sourceDecks.length}
				onNavigate={props.onNavigate}
			/>
			{page === 'sets' && <SetTabs tab={filters.tab} onChange={(tab) => props.onFilterChange({ tab })} />}
			<LibraryFilters
				filters={filters}
				topics={[...new Set(decks.map((deck) => deck.topic))]}
				layout={props.layout}
				onChange={props.onFilterChange}
				onLayoutChange={props.onLayoutChange}
			/>
			<LibraryResults
				page={page}
				isAdmin={props.isAdmin}
				state={state}
				filters={filters}
				decks={filtered}
				layout={props.layout}
				emptyCollection={emptyCollection}
				onReset={resetResults}
				onStudy={props.onStudy}
				onBookmark={props.onBookmark}
			/>
		</section>
	);
}

function LibraryHeading({ page, isAdmin, onImport }: Pick<Props, 'page' | 'isAdmin' | 'onImport'>) {
	return (
		<div className="page-heading">
			<div>
				<span className="eyebrow">
					{page === 'sets' ? 'COLLECTED BY YOU. LEARNED BY YOU.' : 'YOUR NEXT WORD IS A NEW POSSIBILITY'}
				</span>
				<h1>{page === 'sets' ? 'A little collection of your own.' : 'Big adventures start with small words.'}</h1>
				<p>
					{page === 'sets'
						? 'Your handpicked, bookmarked, and imported vocabulary sets.'
						: 'Find your level, discover new words, and make them yours.'}
				</p>
			</div>
			{isAdmin && (
				<button className="button secondary import-top" onClick={onImport}>
					<Upload size={17} /> Import vocabulary
				</button>
			)}
		</div>
	);
}

function LibraryToolbar({
	page,
	isAdmin,
	state,
	count,
	onNavigate: navigate,
}: Pick<Props, 'page' | 'isAdmin' | 'state' | 'onNavigate'> & { count: number }) {
	return (
		<div className="section-head">
			<div className="section-title">
				<h2>{page === 'sets' ? 'My study sets' : isAdmin ? 'Explore the vocabulary library' : 'Available sets'}</h2>
				<span className="count-badge">{count} sets</span>
			</div>
			{isAdmin &&
				(page === 'library' ? (
					<button className="text-button prepare-link" onClick={() => navigate('prepare')}>
						<GraduationCap size={17} /> Preparing a lesson? <ArrowRight size={15} />
					</button>
				) : (
					<div className="sets-actions">
						<button
							className="text-button"
							onClick={() => VocabularyExport.download(state.decks)}
							disabled={!state.decks.length}
						>
							Export words
						</button>
						<button className="text-button" onClick={() => navigate('prepare')}>
							<Plus size={17} /> Create a set
						</button>
					</div>
				))}
		</div>
	);
}

function SetTabs({ tab, onChange }: { tab: FilterValues['tab']; onChange: (tab: FilterValues['tab']) => void }) {
	const tabs = [
		{ id: 'all', label: 'All my sets' },
		{ id: 'created', label: 'Created by me' },
		{ id: 'saved', label: 'Bookmarked' },
	] as const;
	return (
		<div className="my-tabs">
			{tabs.map((item) => (
				<button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => onChange(item.id)}>
					{item.label}
				</button>
			))}
		</div>
	);
}

function LibraryFooter({ page, isAdmin, onNavigate: navigate }: Pick<Props, 'page' | 'isAdmin' | 'onNavigate'>) {
	return (
		<>
			{isAdmin && page === 'library' && (
				<section className="teacher-banner">
					<span className="teacher-icon">
						<GraduationCap size={27} />
					</span>
					<div>
						<h3>A little less prep. A little more teaching.</h3>
						<p>Pick a level and create a vocabulary set that fits your students.</p>
					</div>
					<button className="button secondary" onClick={() => navigate('prepare')}>
						Prepare a lesson
						<ArrowRight size={16} />
					</button>
				</section>
			)}
			<footer className="page-footer">
				<span>
					<Leaf size={14} /> Made for steady growth, at your own pace.
				</span>
				<span>
					<Monitor size={14} /> Saved on this device
				</span>
			</footer>
		</>
	);
}
