export type Role = 'student' | 'admin';
export type Page = 'library' | 'sets' | 'prepare' | 'progress';

// Temporary client-side access control. Replace with server authentication
// before using this app with protected data.
export function authenticateAdmin(username: string, password: string): Role | null {
	return username === 'admin' && password === 'admin' ? 'admin' : null;
}

export function canAccessPage(role: Role, page: Page): boolean {
	return role === 'admin' || page === 'library';
}
