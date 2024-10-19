import { ReactNode } from 'react';
import { User } from 'firebase/auth';

export interface AuthContextType {
	currentUser: User | null;
}

export interface AuthProviderProps {
	children: ReactNode;
}
