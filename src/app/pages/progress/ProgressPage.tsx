import { DeckCard } from '@/app/components/DeckCard';
import { levelNames, starterDecks } from '@/data/vocabulary';
import { DeckCollection } from '@/lib/decks/DeckCollection';
import { LEVELS, type Deck, type SavedState } from '@/lib/types';
import { ChartNoAxesCombined, Check, Layers, Target } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = { decks: Deck[]; state: SavedState; onStudy: (deck: Deck) => void; onBookmark: (deck: Deck) => void };

/** Shows progress across unique words and offers sets to continue studying. */
export function ProgressPage({ decks, state, onStudy: study, onBookmark: bookmark }: Props) {
	const words = DeckCollection.uniqueWords(decks);
	const learned = words.filter((word) => state.progress[word.id] === 'known').length;
	const reviewed = words.filter((word) => state.progress[word.id]).length;
	return (
		<>
			<ProgressHeading />
			<ProgressStats decks={decks} state={state} learned={learned} reviewed={reviewed} />
			<LevelProgress decks={decks} state={state} />
			<div className="section-head progress-sets-heading">
				<h2>{reviewed ? 'Keep the momentum going' : 'Your first word is waiting'}</h2>
			</div>
			<div className="deck-grid">
				{(reviewed ? decks.filter((d) => d.words.some((w) => state.progress[w.id])) : starterDecks.slice(0, 3)).map(
					(d) => (
						<DeckCard
							key={d.id}
							deck={d}
							saved={state.bookmarks.includes(d.id)}
							progress={state.progress}
							onSave={() => bookmark(d)}
							onStudy={() => study(d)}
						/>
					)
				)}
			</div>
		</>
	);
}
function Stat({ icon, value, label, color }: { icon: ReactNode; value: number; label: string; color: string }) {
	return (
		<div className="stat">
			<span className={`stat-icon ${color}`}>{icon}</span>
			<div>
				<strong>{value}</strong>
				<span>{label}</span>
			</div>
		</div>
	);
}

function LevelProgress({ decks, state }: Pick<Props, 'decks' | 'state'>) {
	return (
		<section className="progress-panel">
			<div className="section-head">
				<h2>Your vocabulary journey</h2>
				<span className="muted">A1 → C2</span>
			</div>
			{LEVELS.map((l) => {
				const words = DeckCollection.uniqueWords(decks.filter((deck) => deck.level === l));
				const count = words.filter((w) => state.progress[w.id] === 'known').length;
				return (
					<div className="level-progress" key={l}>
						<span className="level-chip">{l}</span>
						<div>
							<strong>{levelNames[l]}</strong>
							<div className="progress-track">
								<span
									style={{
										width: `${(count / words.length) * 100}%`,
									}}
								/>
							</div>
						</div>
						<span>
							{count} / {words.length}
						</span>
					</div>
				);
			})}
		</section>
	);
}

function ProgressHeading() {
	return (
		<div className="page-heading">
			<div>
				<span className="eyebrow">EVERY WORD IS A STEP FORWARD</span>
				<h1>Look how far you’re growing.</h1>
				<p>Your learning journey, one little win at a time.</p>
			</div>
			<span className="heading-icon">
				<ChartNoAxesCombined size={30} />
			</span>
		</div>
	);
}

function ProgressStats({
	decks,
	state,
	learned,
	reviewed,
}: Pick<Props, 'decks' | 'state'> & { learned: number; reviewed: number }) {
	return (
		<div className="stats-row">
			<Stat icon={<Check />} value={learned} label="Words learned" color="green" />
			<Stat icon={<Target />} value={reviewed - learned} label="Words to practice" color="peach" />
			<Stat
				icon={<Layers />}
				value={decks.filter((d) => d.words.every((w) => state.progress[w.id] === 'known')).length}
				label="Sets completed"
				color="purple"
			/>
		</div>
	);
}
