import { Button } from '@mui/material';
import { useAuth } from '../../hooks';

export const Home = () => {
	const { currentUser, userStore } = useAuth();
	console.log('from context: ', currentUser, userStore);
	return (
		<div>
			<br />
			<Button variant='contained'>Create template</Button>
		</div>
	);
};
