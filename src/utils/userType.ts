import { ADMIN_PREFIX, USER_ROLE } from './constants.ts';
import { UserRole } from '../Providers/AuthProvider';

export const getUserType = (username: string): UserRole => {
	return username.startsWith(ADMIN_PREFIX) ? USER_ROLE.admin : USER_ROLE.user;
};

export const normalizeUsername = (username: string) => {
	return getUserType(username) === USER_ROLE.admin
		? username.substring(ADMIN_PREFIX.length)
		: username;
};
