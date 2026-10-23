import { type Deck } from '@/lib/types';
import { ChevronRight, Menu } from 'lucide-react';
type Props = {
	mobileOpen: boolean;
	activeDeck: Deck | null;
	pageLabel?: string;
	isAdmin: boolean;
	onOpenMenu: () => void;
	onSignIn: () => void;
	onSignOut: () => void;
};

/** Shows the current location and the existing account actions. */
export function Topbar({ mobileOpen, activeDeck, pageLabel, isAdmin, onOpenMenu, onSignIn, onSignOut }: Props) {
	return (
		<header className="topbar">
			<div className="breadcrumbs">
				<button
					className="mobile-menu icon-button"
					aria-label="Open menu"
					aria-expanded={mobileOpen}
					onClick={() => onOpenMenu()}
				>
					<Menu size={21} />
				</button>
				<span>Your workspace</span>
				<ChevronRight size={14} />
				<strong>{activeDeck ? 'Flashcards' : pageLabel}</strong>
			</div>
			<div className="topbar-right">
				<span className="language-pair">
					English <span>↔</span> <span lang="vi">Tiếng Việt</span>
				</span>
				<span className="topbar-divider" />
				<span className="role-label">{isAdmin ? 'Admin' : 'Student'}</span>
				<button className="text-button auth-button" onClick={isAdmin ? onSignOut : onSignIn}>
					{isAdmin ? 'Sign out' : 'Admin login'}
				</button>
			</div>
		</header>
	);
}
