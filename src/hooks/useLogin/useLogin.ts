import { useState } from 'react';
import {
	AuthError,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { useAuth } from '../useAuth/useAuth';
import { auth } from '../../services/firebase';
import { UseLoginProps, UseLoginResult } from './types';

export const useLogin = ({
	email,
	password,
	username,
	isRegister,
}: UseLoginProps): UseLoginResult => {
	const { currentUser } = useAuth(); // Access global user state
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (): Promise<void> => {
		setLoading(true);
		setError(null);

		try {
			if (isRegister && username) {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;

				// Update Firebase profile with the username
				await updateProfile(user, { displayName: username });
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}
		} catch (err) {
			const firebaseError = err as AuthError;
			setError(firebaseError.message);
		} finally {
			setLoading(false);
		}
	};

	return { login, loading, error, currentUser };
};
