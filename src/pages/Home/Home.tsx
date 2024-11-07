import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TemplateList } from '../../components';
import { useAuth, useRequests } from '../../hooks';
import { ROUTES } from '../../utils';

export const Home = () => {
	const { currentUser, userStore } = useAuth();
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
			<Box sx={{ display: 'flex' }}>
				{currentUser && userStore && (
					<RouterLink to={ROUTES.jiraTickets}>
						<Button
							component='span'
							variant='contained'
							color='primary'
							sx={{ margin: '0 0.5rem' }}
						>
							Check Jira tickets
						</Button>
					</RouterLink>
				)}

				{requestCount > 0 && (
					<RouterLink to={ROUTES.requests.route} style={{ textDecoration: 'none' }}>
						<Button
							variant='contained'
							color='secondary'
							sx={{ position: 'relative', margin: '0 0.5rem' }}
						>
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
				)}
			</Box>

			<Typography component='h1' variant='h3' color='primary' sx={{ textAlign: 'center' }}>
				Templates
			</Typography>

			<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
				{currentUser && userStore && (
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
