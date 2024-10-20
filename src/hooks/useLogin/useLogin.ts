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
import { UseLoginProps, UseLoginResult, UserDataProps } from './types';

export const useLogin = ({
	email,
	password,
	username,
	isRegister,
}: UseLoginProps): UseLoginResult => {
	const { currentUser, logout } = useAuth(); // Access global user state
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (): Promise<void> => {
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
				await setDoc(userDocRef, { email, role: 'user', blocked: false });
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

			console.log('User data:', userData);
		} catch (err) {
			const firebaseError = err as AuthError;
			setError(firebaseError.message);
		} finally {
			setLoading(false);
		}
	};

	return { login, logout, loading, error, currentUser };
};
