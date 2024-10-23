import { Link as RouterLink } from 'react-router-dom';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	CircularProgress,
	ListItemButton,
} from '@mui/material';
import { useRequests } from '../../hooks';
import { ROUTES } from '../../utils';

export const RequestsList = () => {
	const { requests, loading, error } = useRequests();

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Typography color='error'>Error loading requests: {error}</Typography>;
	}

	return (
		<Box>
			<Typography variant='h6' gutterBottom>
				Your Requests
			</Typography>
			<List>
				{requests.map(request => (
					<ListItem key={request.id} disablePadding>
						<ListItemButton component={RouterLink} to={ROUTES.requests.request.link + request.id}>
							<ListItemText
								primary={request.templateTitle}
								secondary={`Status: ${request.status}`}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);
};
