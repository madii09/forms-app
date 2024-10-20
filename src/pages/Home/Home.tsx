import { Button } from '@mui/material';
import { Navbar } from '../../components';
import { useAuth } from '../../hooks';

export const Home = () => {
	const { currentUser, userStore } = useAuth();
	console.log('from context: ', currentUser, userStore);
	return (
		<div>
			<Navbar />
			<br />
			<Button variant='contained'>Create template</Button>
		</div>
	);
};
