import { useState } from 'react';
import {
	AuthError,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LoginProps, UseLoginProps, UseLoginResult } from './types';
import { getUserType, normalizeUsername } from '../../utils';

export const useLogin = ({ isRegister }: UseLoginProps): UseLoginResult => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

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
				await updateProfile(user, { displayName: normalizeUsername(username) });

				// Set initial role and status in Firestore
				const userDocRef = doc(db, 'users', user.uid);
				await setDoc(userDocRef, {
					email,
					role: getUserType(username),
					blocked: false,
					username: normalizeUsername(username),
				});
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
		} catch (err) {
			const firebaseError = err as AuthError;
			setError(firebaseError.message);
		} finally {
			setLoading(false);
		}
	};

	return { login, loading, error };
};
