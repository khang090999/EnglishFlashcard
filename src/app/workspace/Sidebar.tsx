import type { Page } from '@/lib/auth';
import { type Deck } from '@/lib/types';
import { ArrowRight, ChevronRight, CircleHelp, Layers, Leaf, X } from 'lucide-react';
import type { RefObject } from 'react';
import type { NavigationItem } from './navigation';

type Props = {
	sidebarRef: RefObject<HTMLElement>;
	mobileOpen: boolean;
	page: Page;
	visiblePages: NavigationItem[];
	myDeckCount: number;
	resumeDeck: Deck;
	onNavigate: (page: Page) => void;
	onStudy: (deck: Deck) => void;
	onClose: () => void;
	onHelp: () => void;
};

/** Displays role-filtered navigation and the mobile navigation container. */
export function Sidebar({
	sidebarRef,
	mobileOpen,
	page,
	visiblePages,
	myDeckCount,
	resumeDeck,
	onNavigate: navigate,
	onStudy: study,
	onClose,
	onHelp,
}: Props) {
	return (
		<aside ref={sidebarRef} className={`sidebar ${mobileOpen ? 'open' : ''}`}>
			<button className="brand" onClick={() => navigate('library')} aria-label="Lexi home">
				<span className="brand-mark">
					<Layers size={23} />
				</span>
				lexi<span className="brand-dot">.</span>
			</button>
			<button className="mobile-close icon-button" aria-label="Close menu" onClick={() => onClose()}>
				<X />
			</button>
			<div className="sidebar-caption">A LITTLE LEARNING, EVERY DAY</div>
			<div className="nav-label">YOUR LEARNING SPACE</div>
			<SidebarNavigation page={page} visiblePages={visiblePages} myDeckCount={myDeckCount} onNavigate={navigate} />
			<SidebarFooter resumeDeck={resumeDeck} onStudy={study} onHelp={onHelp} />
		</aside>
	);
}

function SidebarFooter({ resumeDeck, onStudy: study, onHelp }: Pick<Props, 'resumeDeck' | 'onStudy' | 'onHelp'>) {
	return (
		<div className="sidebar-bottom">
			<div className="grow-card">
				<span className="grow-icon">
					<Leaf size={28} strokeWidth={1.5} />
				</span>
				<h3>Small steps. Big growth.</h3>
				<p>
					A few new words today.
					<br />A little more confidence tomorrow.
				</p>
				<button onClick={() => study(resumeDeck)}>
					Let’s practice <ArrowRight size={15} />
				</button>
			</div>
			<button className="help-button" onClick={() => onHelp()}>
				<CircleHelp size={18} /> A little help <ChevronRight size={16} />
			</button>
			<div className="local-note">
				<span /> Your own little learning space
			</div>
		</div>
	);
}

function SidebarNavigation({
	page,
	visiblePages,
	myDeckCount,
	onNavigate: navigate,
}: Pick<Props, 'page' | 'visiblePages' | 'myDeckCount' | 'onNavigate'>) {
	return (
		<nav aria-label="Main navigation">
			{visiblePages.map((p) => (
				<button
					key={p.id}
					className={`nav-item ${page === p.id ? 'active' : ''}`}
					onClick={() => navigate(p.id)}
					aria-current={page === p.id ? 'page' : undefined}
				>
					<p.icon size={19} />
					<span>{p.label}</span>
					{p.id === 'sets' && myDeckCount > 0 && <span className="nav-count">{myDeckCount}</span>}
				</button>
			))}
		</nav>
	);
}
