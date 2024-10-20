export interface UseAdminResult {
	promoteToAdmin: (uids: string[]) => Promise<void>;
	demoteFromAdmin: (uids: string[]) => Promise<void>;
	blockUser: (uids: string[]) => Promise<void>;
	unblockUser: (uids: string[]) => Promise<void>;
	deleteUser: (uids: string[]) => Promise<void>;
}
