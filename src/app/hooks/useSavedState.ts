import { decodeState, STORAGE_KEY } from '@/lib/storage';
import type { SavedState } from '@/lib/types';
import { useEffect, useState } from 'react';

function readSavedState() {
	try {
		return decodeState(localStorage.getItem(STORAGE_KEY));
	} catch {
		return decodeState(null);
	}
}

/** Restores local vocabulary and reports failed browser writes to the UI. */
export function useSavedState() {
	const [state, setState] = useState<SavedState>(readSavedState);
	const [storageError, setStorageError] = useState(false);
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			setStorageError(false);
		} catch {
			setStorageError(true);
		}
	}, [state]);
	return { state, setState, storageError };
}
