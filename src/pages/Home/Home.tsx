import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../utils';
import { TemplateList } from '../../components';

export const Home = () => {
	const { isUserAdmin } = useAuth();

	return (
		<Box sx={{ padding: '0 1rem' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography component='h1' variant='h4' color='primary' sx={{ textAlign: 'center' }}>
					Templates
				</Typography>
				{isUserAdmin && (
					<RouterLink to={ROUTES.createTemplate}>
						<Button component='span' variant='contained' color='primary'>
							Create template
						</Button>
					</RouterLink>
				)}
			</Box>

			<TemplateList />
		</Box>
	);
};
