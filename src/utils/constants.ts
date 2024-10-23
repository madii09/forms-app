import { UserRole } from '../Providers/AuthProvider';

export const USER_ROLE: Record<UserRole, UserRole> = {
	admin: 'admin',
	user: 'user',
};

export const ADMIN_PREFIX = '@admin:';

export const MAX_DESCRIPTION_LENGTH = 100; // Maximum characters before truncating
