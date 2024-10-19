import { useContext } from 'react';
import { AuthContextType } from '../../Providers/AuthProvider';
import { AuthContext } from '../../Providers/AuthProvider';

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
