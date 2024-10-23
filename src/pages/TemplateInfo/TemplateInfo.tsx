import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	Box,
	Typography,
	CircularProgress,
	Card,
	CardContent,
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';
import { RequestProps, TemplateProps, useAuth, UserDataProps, useRequests } from '../../hooks';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const TemplateInfo = () => {
	const { id } = useParams<{ id: string }>();

	const [template, setTemplate] = useState<TemplateProps | null>(null);
	const [requests, setRequests] = useState<RequestProps[]>([]);
	const [loadingData, setLoadingData] = useState<boolean>(true);
	const [users, setUsers] = useState<{ [key: string]: UserDataProps }>({});

	const { currentUser } = useAuth();
	const { fetchSubmittedRequestsByTemplateId, loading } = useRequests();

	const getUserById = async (uid: string): Promise<UserDataProps | null> => {
		try {
			const userDoc = await getDoc(doc(db, 'users', uid));
			if (userDoc.exists()) {
				return { ...userDoc.data(), uid: userDoc.id } as UserDataProps;
			} else {
				console.warn(`User with ID ${uid} not found.`);
				return null;
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
			return null;
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			if (!id || !currentUser) return;
			setLoadingData(true);
			try {
				const { template, requests } = await fetchSubmittedRequestsByTemplateId(
					id,
					currentUser.uid,
				);
				setTemplate(template);
				setRequests(requests);

				// Fetch user data for each submitted request
				const userFetchPromises = requests.map(request => getUserById(request.userId));
				const fetchedUsers = await Promise.all(userFetchPromises);
				const usersMap = fetchedUsers.reduce(
					(acc, user) => {
						if (user) acc[user.uid] = user;
						return acc;
					},
					{} as { [key: string]: UserDataProps },
				);
				setUsers(usersMap);
			} catch (err) {
				console.error('Error loading template info:', err);
			} finally {
				setLoadingData(false);
			}
		};

		fetchData();
	}, [id, currentUser, fetchSubmittedRequestsByTemplateId]);

	if (loading || loadingData) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
			{template ? (
				<>
					<Card sx={{ marginBottom: '2rem' }}>
						<CardContent>
							<Typography variant='h4' gutterBottom>
								{template.title}
							</Typography>
							<Typography variant='body1' paragraph>
								{template.description}
							</Typography>
						</CardContent>
					</Card>

					<Typography variant='h5' gutterBottom>
						Submitted Responses
					</Typography>
					{requests.length > 0 ? (
						requests.map(request => {
							const user = users[request.userId];
							return (
								<Card key={request.id} sx={{ marginBottom: '2rem' }}>
									<CardContent>
										<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
											<Avatar sx={{ marginRight: 2 }}>
												{user?.username.charAt(0).toUpperCase() || 'U'}
											</Avatar>
											<Box>
												<Typography variant='h6'>{user?.username || 'Unknown User'}</Typography>
												<Typography variant='body2' color='textSecondary'>
													Submitted on:{' '}
													{request.submittedAt &&
														new Date(request.submittedAt.seconds * 1000).toLocaleDateString()}
												</Typography>
											</Box>
										</Box>
										<Divider sx={{ marginBottom: 2 }} />
										<List>
											{template.questions.map(question => (
												<ListItem
													key={question.id}
													sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
												>
													<ListItemText
														primary={question.text}
														primaryTypographyProps={{ variant: 'subtitle1' }}
														secondary={
															Array.isArray(request.responses[question.id])
																? (request.responses[question.id] as string[]).join(', ')
																: request.responses[question.id]
														}
														secondaryTypographyProps={{ variant: 'body2', color: 'textPrimary' }}
													/>
													<Divider sx={{ width: '100%', marginY: 1 }} />
												</ListItem>
											))}
										</List>
									</CardContent>
								</Card>
							);
						})
					) : (
						<Typography>No responses have been submitted yet.</Typography>
					)}
				</>
			) : (
				<Typography color='error'>Template not found or an error occurred.</Typography>
			)}
		</Box>
	);
};
