import { useEffect, useRef } from 'react';

/** Locks scrolling, traps focus, and restores focus when the drawer closes. */
export function useMobileNavigation(mobileOpen: boolean, setMobileOpen: (open: boolean) => void) {
	const sidebarRef = useRef<HTMLElement>(null);
	useEffect(() => {
		if (!mobileOpen) {
			return;
		}
		const sidebar = sidebarRef.current!;
		const previous = document.activeElement as HTMLElement;
		const oldOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		sidebar.querySelector<HTMLButtonElement>('.mobile-close')?.focus();
		function onKey(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				event.preventDefault();
				setMobileOpen(false);
			}
			if (event.key !== 'Tab') {
				return;
			}
			const targets = Array.from(sidebar.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]')).filter(
				(el) => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden'
			);
			const first = targets[0],
				last = targets[targets.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
		function onResize() {
			if (window.innerWidth > 720) {
				setMobileOpen(false);
			}
		}
		window.addEventListener('keydown', onKey);
		window.addEventListener('resize', onResize);
		return () => {
			document.body.style.overflow = oldOverflow;
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('resize', onResize);
			previous?.focus();
		};
	}, [mobileOpen, setMobileOpen]);

	return sidebarRef;
}
