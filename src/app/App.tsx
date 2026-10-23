import type { Role } from '@/lib/auth';
import { useState } from 'react';
import { Login } from './components/Login';
import { useSavedState } from './hooks/useSavedState';
import { Workspace } from './workspace/Workspace';

/** Keeps the session role and persisted vocabulary above the workspace lifecycle. */
export default function App() {
	const [role, setRole] = useState<Role>('student');
	const [loginOpen, setLoginOpen] = useState(false);
	const { state, setState, storageError } = useSavedState();
	if (loginOpen) {
		return (
			<Login
				onBack={() => setLoginOpen(false)}
				onLogin={(nextRole) => {
					setRole(nextRole);
					setLoginOpen(false);
				}}
			/>
		);
	}
	return (
		<Workspace
			key={role}
			role={role}
			state={state}
			setState={setState}
			storageError={storageError}
			onSignIn={() => setLoginOpen(true)}
			onSignOut={() => setRole('student')}
		/>
	);
}
