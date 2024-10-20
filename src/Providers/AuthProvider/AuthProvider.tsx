import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { AuthContextProps, AuthProviderProps, UserStoreProps } from './types';
import { USER_ROLE } from '../../utils';

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userStore, setUserStore] = useState<UserStoreProps | null>(null);
	const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);

	const logout = async (): Promise<void> => {
		await signOut(auth);
		setCurrentUser(null);
		setUserStore(null);
	};

	useEffect(() => {
		return onAuthStateChanged(auth, async user => {
			if (user) {
				const userDoc = await getDoc(doc(db, 'users', user.uid));
				if (userDoc.exists()) {
					const data = userDoc.data();
					setUserStore(data as UserStoreProps);
					setIsUserAdmin(data.role === USER_ROLE.admin);
				}
			}
			setCurrentUser(user);
		});
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser, userStore, isUserAdmin, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
