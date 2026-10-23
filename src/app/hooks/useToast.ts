import { useEffect, useState } from 'react';

/** Dismisses a status message four seconds after it changes. */
export function useToast() {
	const [toast, setToast] = useState('');
	useEffect(() => {
		if (!toast) {
			return;
		}
		const timer = setTimeout(() => setToast(''), 4000);
		return () => clearTimeout(timer);
	}, [toast]);
	return { toast, setToast };
}
