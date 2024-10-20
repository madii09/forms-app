import { useState } from 'react';
import {
	AuthError,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { useAuth } from '../useAuth/useAuth';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LoginProps, UseLoginProps, UseLoginResult, UserDataProps } from './types';
import { USER_ROLE } from '../../utils';

export const useLogin = ({ isRegister }: UseLoginProps): UseLoginResult => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const { currentUser, logout } = useAuth(); // Access global user state

	const login = async ({ email, password, username }: LoginProps): Promise<void> => {
		setLoading(true);
		setError(null);

		try {
			let userCredential;
			if (isRegister && username) {
				// Register the user
				userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;

				// Update Firebase profile with the username
				await updateProfile(user, { displayName: username });

				// Set initial role and status in Firestore
				const userDocRef = doc(db, 'users', user.uid);
				await setDoc(userDocRef, { email, role: USER_ROLE.user, blocked: false });
			} else {
				// Log the user in
				userCredential = await signInWithEmailAndPassword(auth, email, password);
			}

			const user = userCredential.user;
			const userDocRef = doc(db, 'users', user.uid);
			const userDoc = await getDoc(userDocRef);

			if (!userDoc.exists()) {
				throw new Error('User not found in Firestore.');
			}

			const userData = userDoc.data() as UserDataProps;

			// Check if the user is blocked
			if (userData.blocked) {
				throw new Error('This account is blocked.');
			}
		} catch (err) {
			const firebaseError = err as AuthError;
			setError(firebaseError.message);
		} finally {
			setLoading(false);
		}
	};

	return { login, logout, loading, error, currentUser };
};
