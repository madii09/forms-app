import { useContext } from 'react';
import { AuthContextProps } from '../../Providers/AuthProvider';
import { AuthContext } from '../../Providers/AuthProvider';

export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
