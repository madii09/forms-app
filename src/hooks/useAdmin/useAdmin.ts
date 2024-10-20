import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../useAuth/useAuth';

export const useAdmin = () => {
	const { currentUser, userStore } = useAuth();

	const isAdmin = userStore?.role === 'admin';

	if (currentUser && !isAdmin) {
		throw new Error('Access denied: Only admins can manage users.');
	}

	const promoteToAdmin = async (uid: string) => {
		await updateDoc(doc(db, 'users', uid), { role: 'admin' });
	};

	const demoteFromAdmin = async (uid: string) => {
		await updateDoc(doc(db, 'users', uid), { role: 'user' });
	};

	const blockUser = async (uid: string) => {
		await updateDoc(doc(db, 'users', uid), { blocked: true });
	};

	const unblockUser = async (uid: string) => {
		await updateDoc(doc(db, 'users', uid), { blocked: false });
	};

	const deleteUser = async (uid: string) => {
		await deleteDoc(doc(db, 'users', uid));
	};

	return { promoteToAdmin, demoteFromAdmin, blockUser, unblockUser, deleteUser };
};
