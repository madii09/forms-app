import { ReactNode } from 'react';
import { User } from 'firebase/auth';

export type UserRole = 'admin' | 'user';

export interface UserStoreProps {
	role: UserRole;
	blocked: boolean;
	email: string;
}

export interface AuthContextProps {
	currentUser: User | null;
	userStore: UserStoreProps | null;
	logout: () => Promise<void>;
}

export interface AuthProviderProps {
	children: ReactNode;
}
