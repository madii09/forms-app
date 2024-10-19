import { User } from 'firebase/auth';

export interface UseLoginProps {
	email: string;
	password: string;
	username?: string;
	isRegister: boolean;
}

export interface UseLoginResult {
	login: () => Promise<void>;
	loading: boolean;
	error: string | null;
	currentUser: User | null;
}
