import {
	Box,
	CircularProgress,
	Container,
	Link,
	List,
	ListItem,
	ListItemText,
	Paper,
	Typography,
} from '@mui/material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';

interface JiraIssue {
	id: string;
	key: string;
	fields: {
		summary: string;
		status: {
			name: string;
		};
		created: string;
		reporter: {
			displayName: string;
		};
	};
}

export const JiraTicketsList = () => {
	const [tickets, setTickets] = useState<JiraIssue[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Hard coding an email here as authenticate users with email in jira is not implemeneted yet.
	const userEmail = 'madina.m.9509@gmail.com';

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const functions = getFunctions();
				const getJiraTickets = httpsCallable(functions, 'getJiraTickets');

				const result = (await getJiraTickets({ userEmail })) as { data: { issues: JiraIssue[] } };
				setTickets(result.data.issues);
			} catch (error) {
				setError('Failed to fetch tickets');
				console.error('Error fetching Jira tickets:', error);
			} finally {
				setLoading(false);
			}
		};

		if (userEmail) {
			fetchTickets();
		}
	}, [userEmail]);

	return (
		<Container maxWidth='sm'>
			{loading && (
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<CircularProgress />
				</Box>
			)}

			{!loading && (
				<Paper style={{ padding: 20 }}>
					<Typography variant='h6'>Your Jira Tickets</Typography>
					{error && <Typography color='error'>{error}</Typography>}

					{tickets.length === 0 ? (
						<Typography>No tickets found.</Typography>
					) : (
						<List>
							{tickets.map(ticket => (
								<ListItem key={ticket.id}>
									<ListItemText
										primary={ticket.fields.summary}
										secondary={
											<>
												<Typography variant='body2'>Status: {ticket.fields.status.name}</Typography>
												<Typography variant='body2'>
													Created by: {ticket.fields.reporter.displayName}
												</Typography>
												<Typography variant='body2'>
													Created on: {new Date(ticket.fields.created).toLocaleString()}
												</Typography>
												<Link
													href={`${import.meta.env.VITE_ATLASSIAN_DOMEN}/browse/${ticket.key}`}
													target='_blank'
													rel='noopener noreferrer'
												>
													View Ticket
												</Link>
											</>
										}
									/>
								</ListItem>
							))}
						</List>
					)}
				</Paper>
			)}
		</Container>
	);
};
