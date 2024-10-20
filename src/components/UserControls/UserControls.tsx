import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UserControlsProps } from './types';

export const UserControls = ({ selectedUsers, onControlUsers }: UserControlsProps) => {
	const isThereAnySelectedUsers = Boolean(selectedUsers.length);

	return (
		<Box sx={{ margin: '2rem 0 1.5rem 0' }}>
			{!isThereAnySelectedUsers && (
				<Typography color='warning' sx={{ paddingBottom: '0.5rem' }}>
					To control User(s) select them from the Users list:
				</Typography>
			)}
			<Button
				disabled={!isThereAnySelectedUsers}
				variant='contained'
				color='success'
				sx={{ marginRight: '0.75rem' }}
				onClick={() => onControlUsers('promoteToAdmin')}
			>
				Promote to Admin
			</Button>
			<Button
				disabled={!isThereAnySelectedUsers}
				variant='contained'
				sx={{ marginRight: '0.75rem' }}
				onClick={() => onControlUsers('demoteFromAdmin')}
			>
				Demote to User
			</Button>
			<Button
				disabled={!isThereAnySelectedUsers}
				variant='contained'
				color='warning'
				sx={{ marginRight: '0.75rem' }}
				onClick={() => onControlUsers('blockUser')}
			>
				Block
			</Button>
			<Button
				disabled={!isThereAnySelectedUsers}
				variant='contained'
				color='info'
				sx={{ marginRight: '0.75rem' }}
				onClick={() => onControlUsers('unblockUser')}
			>
				Unblock
			</Button>
			<Button
				disabled={!isThereAnySelectedUsers}
				variant='contained'
				color='error'
				sx={{ marginRight: '0.75rem' }}
				onClick={() => onControlUsers('deleteUser')}
			>
				Delete
			</Button>
		</Box>
	);
};
