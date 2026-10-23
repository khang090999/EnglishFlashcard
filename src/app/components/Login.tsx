import { authenticateAdmin, type Role } from '@/lib/auth';
import { ArrowLeft, ArrowRight, Layers, LockKeyhole } from 'lucide-react';
import { useState, type FormEvent } from 'react';

export function Login({ onLogin, onBack }: { onLogin: (role: Role) => void; onBack: () => void }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const role = authenticateAdmin(username, password);
		if (!role) {
			setError('Incorrect username or password. Please try again.');
			return;
		}
		onLogin(role);
	}

	return (
		<main className="login-page">
			<section className="login-card" aria-labelledby="login-heading">
				<div className="brand" aria-label="Lexi">
					<span className="brand-mark">
						<Layers size={23} />
					</span>
					lexi<span className="brand-dot">.</span>
				</div>
				<span className="login-icon">
					<LockKeyhole size={25} />
				</span>
				<span className="eyebrow">YOUR TEACHING SPACE</span>
				<h1 id="login-heading">Welcome back.</h1>
				<p>Sign in as an admin to manage vocabulary and prepare lessons.</p>
				<form onSubmit={submit} className="login-form">
					<label htmlFor="username">
						Username
						<input
							id="username"
							name="username"
							autoComplete="username"
							autoCapitalize="none"
							spellCheck={false}
							required
							autoFocus
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
								setError('');
							}}
							aria-invalid={!!error}
							aria-describedby={error ? 'login-error' : undefined}
						/>
					</label>
					<label htmlFor="password">
						Password
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setError('');
							}}
							aria-invalid={!!error}
							aria-describedby={error ? 'login-error' : undefined}
						/>
					</label>
					{error && (
						<p id="login-error" className="error-box" role="alert">
							{error}
						</p>
					)}
					<button type="submit" className="button primary full">
						Sign in <ArrowRight size={17} />
					</button>
				</form>
				<button className="text-button login-back" onClick={onBack}>
					<ArrowLeft size={16} /> Continue as student
				</button>
				<p className="login-note">Students can explore available sets without an account.</p>
			</section>
		</main>
	);
}
