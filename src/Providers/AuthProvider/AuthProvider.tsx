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
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);

	const logout = async (): Promise<void> => {
		await signOut(auth);
		setCurrentUser(null);
		setUserStore(null);
	};

	useEffect(() => {
		return onAuthStateChanged(auth, async user => {
			setIsLoading(true);
			if (user) {
				const userDoc = await getDoc(doc(db, 'users', user.uid));
				if (userDoc.exists()) {
					const data = userDoc.data();
					if (!data.blocked) {
						setIsUserBlocked(false);
						setUserStore(data as UserStoreProps);
						setIsUserAdmin(data.role === USER_ROLE.admin);
					} else {
						await logout();
						setIsUserBlocked(true);
					}
				}
			}
			setCurrentUser(user);
			setIsLoading(false);
		});
	}, [isUserBlocked]);

	return (
		<AuthContext.Provider
			value={{ currentUser, userStore, isUserAdmin, isLoading, isUserBlocked, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};
