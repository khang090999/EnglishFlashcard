import type { Deck, Progress, Word } from '@/lib/types';
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Keyboard,
	Layers,
	PartyPopper,
	Repeat2,
	RotateCcw,
	Shuffle,
	Volume2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { TopicIcon } from './Icon';
function shuffled(words: Word[]) {
	const copy = [...words];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}
export function Study({
	deck,
	progress,
	onGrade,
	onBack,
}: {
	deck: Deck;
	progress: Progress;
	onGrade: (id: string, grade: 'known' | 'review') => void;
	onBack: () => void;
}) {
	const [cards, setCards] = useState(deck.words);
	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [graded, setGraded] = useState<Record<string, 'known' | 'review'>>({});
	const [complete, setComplete] = useState(false);
	const [speechError, setSpeechError] = useState('');
	const word = cards[index];
	const known = deck.words.filter((w) => progress[w.id] === 'known').length;
	const move = useCallback(
		(delta: number) => {
			setIndex((i) => Math.max(0, Math.min(cards.length - 1, i + delta)));
			setFlipped(false);
			setSpeechError('');
		},
		[cards.length]
	);
	function grade(value: 'known' | 'review') {
		onGrade(word.id, value);
		const next = { ...graded, [word.id]: value };
		setGraded(next);
		setFlipped(false);
		if (cards.every((w) => next[w.id])) {
			setComplete(true);
		} else {
			const nextIndex = cards.findIndex((w, i) => i > index && !next[w.id]);
			setIndex(nextIndex >= 0 ? nextIndex : cards.findIndex((w) => !next[w.id]));
		}
	}
	function restart(reviewOnly = false) {
		const review = deck.words.filter((w) => progress[w.id] !== 'known');
		setCards(reviewOnly && review.length ? review : deck.words);
		setIndex(0);
		setGraded({});
		setFlipped(false);
		setComplete(false);
	}
	useEffect(() => {
		function key(e: KeyboardEvent) {
			if (complete || (e.target as HTMLElement).closest('input,textarea,select,button,a,dialog')) {
				return;
			}
			if (e.code === 'Space') {
				e.preventDefault();
				setFlipped((f) => !f);
			}
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				move(-1);
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				move(1);
			}
		}
		window.addEventListener('keydown', key);
		return () => window.removeEventListener('keydown', key);
	}, [complete, move]);
	useEffect(
		() => () => {
			if ('speechSynthesis' in window) {
				window.speechSynthesis.cancel();
			}
		},
		[]
	);
	function speak() {
		if (!('speechSynthesis' in window)) {
			setSpeechError('Pronunciation is not supported by this browser. You can use the IPA below.');
			return;
		}
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(word.english);
		utterance.lang = 'en-GB';
		utterance.rate = 0.85;
		utterance.onerror = (event) => {
			if (event.error !== 'interrupted' && event.error !== 'canceled') {
				setSpeechError('Audio is unavailable right now. Use the phonetic guide below.');
			}
		};
		window.speechSynthesis.speak(utterance);
	}
	return (
		<div className="study-page">
			<button className="back-link" onClick={onBack}>
				<ArrowLeft size={17} /> Back to vocabulary
			</button>
			<div className="study-header">
				<div className={`study-icon ${deck.color}`}>
					<TopicIcon name={deck.icon} />
				</div>
				<div>
					<div className="eyebrow">
						{deck.level} · {deck.topic}
					</div>
					<h1>{deck.title}</h1>
					<p>
						{deck.words.length} {deck.words.length === 1 ? 'word' : 'words'} · English ↔ Vietnamese
					</p>
				</div>
			</div>
			{complete ? (
				<div className="completion">
					<div className="completion-icon">
						<PartyPopper size={44} />
					</div>
					<span className="eyebrow">LITTLE STEPS. REAL PROGRESS.</span>
					<h2>You showed up. Well done!</h2>
					<p>You practiced {cards.length} words in this session.</p>
					<div className="completion-stats">
						<div>
							<strong>{Object.values(graded).filter((g) => g === 'known').length}</strong>
							<span>Got it</span>
						</div>
						<div>
							<strong>{Object.values(graded).filter((g) => g === 'review').length}</strong>
							<span>Keep practicing</span>
						</div>
					</div>
					<div className="completion-actions">
						{known < deck.words.length && (
							<button className="button primary" onClick={() => restart(true)}>
								<Repeat2 size={17} /> Practice unlearned words
							</button>
						)}
						<button className="button secondary" onClick={() => restart()}>
							<RotateCcw size={17} /> Study again
						</button>
					</div>
					<button className="text-button" onClick={onBack}>
						Explore more vocabulary <ArrowRight size={16} />
					</button>
				</div>
			) : (
				<>
					<div className="study-toolbar">
						<span>
							<Layers size={17} /> Flashcards
						</span>
						<button
							className="text-button"
							onClick={() => {
								setCards(shuffled(cards));
								setIndex(0);
								setFlipped(false);
							}}
						>
							<Shuffle size={16} /> Shuffle
						</button>
					</div>
					<div className="session-progress">
						<span
							style={{
								width: `${(Object.keys(graded).length / cards.length) * 100}%`,
							}}
						/>
					</div>
					<div className={`flashcard ${flipped ? 'is-flipped' : ''}`}>
						<button
							className="card-flip-target"
							aria-label={`${flipped ? word.vietnamese : word.english + ' ' + (word.phonetic || '')}. ${flipped ? 'Show English' : 'Flip to Vietnamese'}`}
							onClick={() => setFlipped((f) => !f)}
						>
							<span className="card-language">{flipped ? 'VIETNAMESE' : 'ENGLISH'}</span>
							<span className="flashcard-word" lang={flipped ? 'vi' : 'en'}>
								{flipped ? word.vietnamese : word.english}
							</span>
							{!flipped && <span className="phonetic">{word.phonetic || 'No phonetic provided'}</span>}
							{flipped ? (
								<span className="translation-hint">
									{word.english} {word.phonetic}
								</span>
							) : (
								word.example && <span className="word-example">“{word.example}”</span>
							)}
							<span className="flip-hint">
								<Repeat2 size={16} /> Click to flip <span>· space</span>
							</span>
						</button>
						<button className="pronounce icon-button" aria-label={`Pronounce ${word.english}`} onClick={speak}>
							<Volume2 size={21} />
						</button>
					</div>
					{speechError && (
						<p role="status" className="field-help">
							{speechError}
						</p>
					)}
					<div className="card-navigation">
						<button className="icon-button" disabled={index === 0} aria-label="Previous card" onClick={() => move(-1)}>
							<ArrowLeft size={21} />
						</button>
						<span>
							<strong>{index + 1}</strong> / {cards.length}
						</span>
						<button
							className="icon-button"
							disabled={index === cards.length - 1}
							aria-label="Next card"
							onClick={() => move(1)}
						>
							<ArrowRight size={21} />
						</button>
					</div>
					<div className="grade-actions">
						<button className="button review-button" onClick={() => grade('review')}>
							<RotateCcw size={18} /> Still learning
						</button>
						<button className="button known-button" onClick={() => grade('known')}>
							<Check size={19} /> Got it!
						</button>
					</div>
					<p className="study-tip">
						{Object.keys(graded).length} of {cards.length} practiced this session · {known} of {deck.words.length}{' '}
						learned in this set
					</p>
					<p className="keyboard-help">
						<Keyboard size={16} />
						<kbd>Space</kbd> flip card <kbd>←</kbd>
						<kbd>→</kbd> navigate
					</p>
				</>
			)}
		</div>
	);
}
