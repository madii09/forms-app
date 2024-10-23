import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useAuth, useRequests } from '../../hooks';
import { TemplateList } from '../../components';
import { ROUTES } from '../../utils';

export const Home = () => {
	const { isUserAdmin } = useAuth();
	const { countPendingRequests } = useRequests();
	const [requestCount, setRequestCount] = useState<number>(0);

	useEffect(() => {
		const fetchRequestCount = async () => {
			const count = await countPendingRequests();
			setRequestCount(count);
		};

		fetchRequestCount();
	}, [countPendingRequests]);

	return (
		<Box sx={{ padding: '0 1rem' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

			{requestCount > 0 && (
				<Box sx={{ marginTop: '1.5rem' }}>
					<RouterLink to={ROUTES.requests.route} style={{ textDecoration: 'none' }}>
						<Button variant='contained' color='secondary' sx={{ position: 'relative' }}>
							Requests ({requestCount})
							{requestCount > 0 && (
								<Box
									component='span'
									sx={{
										position: 'absolute',
										top: -5,
										right: -10,
										backgroundColor: 'red',
										borderRadius: '50%',
										width: '20px',
										height: '20px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: 'white',
										fontSize: '0.8rem',
									}}
								>
									{requestCount}
								</Box>
							)}
						</Button>
					</RouterLink>
				</Box>
			)}

			<TemplateList />
		</Box>
	);
};
