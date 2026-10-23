import { levelNames } from '@/data/vocabulary';
import type { LibraryFilters as FilterValues } from '@/lib/decks/DeckCollection';
import { LEVELS } from '@/lib/types';
import { ChevronDown, Grid2X2, List, Search, SlidersHorizontal, X } from 'lucide-react';

type Props = {
	filters: FilterValues;
	topics: string[];
	layout: string;
	onChange: (change: Partial<FilterValues>) => void;
	onLayoutChange: (layout: string) => void;
};

/** Edits search, topic, level, and layout independently of the result grid. */
export function LibraryFilters({ filters, topics, layout, onChange, onLayoutChange: setLayout }: Props) {
	const { query, topic, level } = filters;
	const setQuery = (query: string) => onChange({ query });
	const setTopic = (topic: string) => onChange({ topic });
	const setLevel = (level: string) => onChange({ level });
	return (
		<>
			<div className="filter-row">
				<SearchFilter query={query} onChange={setQuery} />
				<label className="topic-filter">
					<SlidersHorizontal size={15} />
					<select aria-label="Filter by topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
						<option>All topics</option>
						{topics.map((t) => (
							<option key={t}>{t}</option>
						))}
					</select>
					<ChevronDown size={14} />
				</label>
				<LayoutSwitch layout={layout} onChange={setLayout} />
			</div>
			<LevelFilter level={level} onChange={setLevel} />
		</>
	);
}

function LevelFilter({ level, onChange: setLevel }: { level: string; onChange: (level: string) => void }) {
	return (
		<div className="level-filter">
			<span>YOUR LEVEL</span>
			<div className="level-pills">
				{['All levels', ...LEVELS].map((l) => (
					<button
						key={l}
						aria-pressed={level === l}
						className={level === l ? 'active' : ''}
						onClick={() => setLevel(l)}
					>
						{l}
						{l !== 'All levels' && <span>{levelNames[l as keyof typeof levelNames]}</span>}
					</button>
				))}
			</div>
		</div>
	);
}

function SearchFilter({ query, onChange: setQuery }: { query: string; onChange: (query: string) => void }) {
	return (
		<label className="search">
			<Search size={18} />
			<input
				aria-label="Search vocabulary sets"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search a topic, set, or word..."
			/>
			{query && (
				<button className="clear-search" aria-label="Clear search" onClick={() => setQuery('')}>
					<X size={15} />
				</button>
			)}
		</label>
	);
}

function LayoutSwitch({ layout, onChange: setLayout }: { layout: string; onChange: (layout: string) => void }) {
	return (
		<div className="view-switch">
			<button
				aria-label="Grid view"
				aria-pressed={layout === 'grid'}
				className={layout === 'grid' ? 'active' : ''}
				onClick={() => setLayout('grid')}
			>
				<Grid2X2 size={17} />
			</button>
			<button
				aria-label="List view"
				aria-pressed={layout === 'list'}
				className={layout === 'list' ? 'active' : ''}
				onClick={() => setLayout('list')}
			>
				<List size={18} />
			</button>
		</div>
	);
}
