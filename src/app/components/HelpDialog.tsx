import { ArrowRight } from 'lucide-react';
import { Modal } from './Modal';

/** Explains the actions available to the current role. */
export function HelpDialog({ isAdmin, onClose }: { isAdmin: boolean; onClose: () => void }) {
	return (
		<Modal title="A little help along the way." subtitle="Make yourself at home in Lexi." onClose={onClose}>
			<div className="help-content">
				<p>
					<strong>Find your starting point.</strong> Browse the library by CEFR level, from A1 beginner to C2
					proficient. These are suggested levels for practice.
				</p>
				<p>
					<strong>Make words stick.</strong> Open a set, tap a card to see its Vietnamese meaning, then choose “Got it!”
					or “Still learning.” Use Space to flip and the arrow keys to move when a button is not focused.
				</p>
				{isAdmin && (
					<p>
						<strong>Make it yours.</strong> Bookmark any set, import a CSV/TSV list, or select words in Prepare a
						lesson. Optional phonetics use the International Phonetic Alphabet (IPA).
					</p>
				)}
				<p>
					<strong>Your own learning space.</strong> Sets and progress stay in this browser. They are not synced across
					devices. Clearing browser data removes them. {isAdmin && 'Export custom words from My sets to keep a copy.'}
				</p>
			</div>
			<button className="button primary full" onClick={onClose}>
				Got it. Let’s grow. <ArrowRight size={16} />
			</button>
		</Modal>
	);
}
