import { doc, WriteBatch, writeBatch } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../services/firebase';
import { useAuth } from '../useAuth/useAuth';
import { USER_ROLE } from '../../utils';
import { UseAdminResult } from './types';

export const useAdmin = (): UseAdminResult => {
	const { currentUser, isUserAdmin } = useAuth();

	if (currentUser && !isUserAdmin) {
		throw new Error('Access denied: Only admins can manage users.');
	}

	const batchOperation = async (
		userIds: string[],
		updateFn: (batch: WriteBatch, uid: string) => void,
	) => {
		const batch = writeBatch(db);
		userIds.forEach(uid => updateFn(batch, uid));
		await batch.commit();
	};

	const promoteToAdmin = (uids: string[]) =>
		batchOperation(uids, (batch, uid) =>
			batch.update(doc(db, 'users', uid), { role: USER_ROLE.admin }),
		);

	const demoteFromAdmin = (uids: string[]) =>
		batchOperation(uids, (batch, uid) =>
			batch.update(doc(db, 'users', uid), { role: USER_ROLE.user }),
		);

	const blockUser = (uids: string[]) =>
		batchOperation(uids, (batch, uid) => batch.update(doc(db, 'users', uid), { blocked: true }));

	const unblockUser = (uids: string[]) =>
		batchOperation(uids, (batch, uid) => batch.update(doc(db, 'users', uid), { blocked: false }));

	const deleteUser = async (uids: string[]) => {
		const deleteCurrentUser = uids.includes(currentUser?.uid || '');

		const deleteUserFromAuth = httpsCallable<{ uid: string }, { message: string }>(
			functions,
			'deleteUserFromAuth',
		);

		try {
			for (const uid of uids) {
				// Step 1: Delete users from Firebase Authentication using Cloud Function
				await deleteUserFromAuth({ uid });
			}
			// Step 2: Delete users from Firestore using batchOperation
			await batchOperation(uids, (batch, uid) => batch.delete(doc(db, 'users', uid)));
		} catch (error) {
			console.error('Failed to delete user from auth:', (error as Error).message);
		}

		if (deleteCurrentUser) window.location.reload();
	};

	return { promoteToAdmin, demoteFromAdmin, blockUser, unblockUser, deleteUser };
};
