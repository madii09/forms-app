import { ReactNode } from 'react';
import { User } from 'firebase/auth';

export type UserRole = 'admin' | 'user';

export interface UserStoreProps {
	username: string;
	role: UserRole;
	blocked: boolean;
	email: string;
}

export interface AuthContextProps {
	currentUser: User | null;
	userStore: UserStoreProps | null;
	isUserAdmin: boolean;
	logout: () => Promise<void>;
	isLoading: boolean;
	isUserBlocked: boolean;
}

export interface AuthProviderProps {
	children: ReactNode;
}
