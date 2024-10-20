import { User } from 'firebase/auth';
import { UserRole } from '../../../Providers/AuthProvider';

export interface UserDataProps {
	email: string;
	role: UserRole;
	blocked: boolean;
	uid: string;
}

export interface LoginProps {
	email: string;
	password: string;
	username?: string;
}

export interface UseLoginProps {
	isRegister: boolean;
}

export interface UseLoginResult {
	login: (props: LoginProps) => Promise<void>;
	logout: () => Promise<void>;
	loading: boolean;
	error: string | null;
	currentUser: User | null;
}
