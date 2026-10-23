import type { Role } from '@/lib/auth';
import type { SavedState } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';

export type WorkspaceProps = {
	role: Role;
	state: SavedState;
	setState: Dispatch<SetStateAction<SavedState>>;
	storageError: boolean;
	onSignIn: () => void;
	onSignOut: () => void;
};
