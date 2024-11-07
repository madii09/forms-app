import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
} from '@mui/material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../utils';

interface CreateTicketDialogProps {
	open: boolean;
	onClose: () => void;
}

export const CreateTicketDialog: React.FC<CreateTicketDialogProps> = ({ open, onClose }) => {
	const [summary, setSummary] = useState('');
	const [priority, setPriority] = useState<'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'>(
		'Medium',
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { userStore } = useAuth();
	const navigate = useNavigate();

	const handleCreateTicket = async () => {
		setLoading(true);
		setError(null);

		const functions = getFunctions();
		const createJiraTicket = httpsCallable(functions, 'createJiraTicket');

		try {
			const link = window.location.href;
			const reportedBy = `email: ${userStore?.email}, username: ${userStore?.username}`;
			await createJiraTicket({
				summary,
				priority,
				link,
				reportedBy,
				templateTitle: 'N/A',
			});
			onClose();
			navigate(ROUTES.jiraTickets);
		} catch {
			setError('Failed to create ticket. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle>Create Support Ticket</DialogTitle>
			<DialogContent>
				<TextField
					label='Summary'
					fullWidth
					margin='normal'
					value={summary}
					onChange={e => setSummary(e.target.value)}
				/>
				<TextField
					label='Priority'
					select
					fullWidth
					margin='normal'
					defaultValue={priority}
					onChange={e =>
						setPriority(e.target.value as 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest')
					}
				>
					<MenuItem value='Highest'>Highest</MenuItem>
					<MenuItem value='High'>High</MenuItem>
					<MenuItem value='Medium'>Medium</MenuItem>
					<MenuItem value='Low'>Low</MenuItem>
					<MenuItem value='Lowest'>Lowest</MenuItem>
				</TextField>
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='secondary'>
					Cancel
				</Button>
				<Button
					onClick={handleCreateTicket}
					color='primary'
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : null}
				>
					{loading ? 'Creating...' : 'Create Ticket'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
