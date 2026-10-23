import type { Page } from '@/lib/auth';
import { BookOpen, ChartNoAxesCombined, GraduationCap, Layers, type LucideIcon } from 'lucide-react';

export type NavigationItem = { id: Page; label: string; icon: LucideIcon };

/** Stable labels and icons; access remains governed by canAccessPage. */
export const navigationItems: NavigationItem[] = [
	{ id: 'library', label: 'Vocabulary library', icon: BookOpen },
	{ id: 'sets', label: 'My sets', icon: Layers },
	{ id: 'prepare', label: 'Prepare a lesson', icon: GraduationCap },
	{ id: 'progress', label: 'My progress', icon: ChartNoAxesCombined },
];
