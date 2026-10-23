import { type Deck } from '@/lib/types';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
type Props = { resumeDeck: Deck; hasLastDeck: boolean; onStudy: (deck: Deck) => void };

/** Introduces the library and resumes the last selected set. */
export function LibraryHero({ resumeDeck, hasLastDeck, onStudy: study }: Props) {
	return (
		<section className="hero">
			<div className="hero-copy">
				<span className="hero-tag">
					<Sparkles size={14} /> YOUR DAILY DOSE OF DISCOVERY
				</span>
				<h2>
					A new word.
					<br />A whole new world.
				</h2>
				<p>
					A little practice goes a long way.
					<br />
					Build your confidence, one flashcard at a time.
				</p>
				<button className="button primary" onClick={() => study(resumeDeck)}>
					{hasLastDeck ? 'Continue learning' : 'Start learning'}
					<ArrowRight size={18} />
				</button>
				<span className="hero-footnote">Just you, a few words, and a fresh start.</span>
			</div>
			<HeroArtwork />
		</section>
	);
}

function HeroArtwork() {
	return (
		<div className="hero-art" aria-hidden="true">
			<span className="art-star star-one">✳</span>
			<span className="art-star star-two">✧</span>
			<div className="orbit orbit-one" />
			<div className="orbit orbit-two" />
			<div className="floating-card rear-card">
				<span>TIẾNG VIỆT</span>
				<strong>nở hoa</strong>
				<Leaf size={24} />
			</div>
			<div className="floating-card front-card">
				<span>ENGLISH</span>
				<div className="flower">
					<i />
					<i />
					<i />
					<i />
					<i />
					<i />
					<b />
				</div>
				<strong>bloom</strong>
				<small>/bluːm/</small>
				<span className="art-card-bottom">
					a little growth, every day <Sparkles size={12} />
				</span>
			</div>
			<div className="art-caption">
				<span>EN</span>
				<span className="repeat-arrow">↔</span>
				<span>VI</span>
			</div>
		</div>
	);
}
