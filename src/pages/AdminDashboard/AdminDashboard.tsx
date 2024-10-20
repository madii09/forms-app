import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useAdmin, UserDataProps } from '../../hooks';
import { db } from '../../services/firebase';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const AdminDashboard: React.FC = () => {
	const { promoteToAdmin, demoteFromAdmin, blockUser, unblockUser, deleteUser } = useAdmin();
	const [users, setUsers] = useState<UserDataProps[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const querySnapshot = await getDocs(collection(db, 'users'));
			const usersList = querySnapshot.docs.map(doc => ({
				uid: doc.id,
				...doc.data(),
			}));
			setUsers(usersList as UserDataProps[]);
		};

		fetchUsers();
	}, []);

	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'UUID', width: 250 },
		{ field: 'email', headerName: 'Email', width: 250 },
		{ field: 'role', headerName: 'Role', width: 100 },
		{ field: 'blocked', headerName: 'Blocked' },
	];

	const rows = useMemo(
		() =>
			users.map(user => {
				return {
					id: user.uid,
					email: user.email,
					role: user.role,
					blocked: user.blocked ? 'Yes' : 'No',
				};
			}),
		[users],
	);

	const paginationModel = { page: 0, pageSize: 10 };

	return (
		<>
			<Typography variant='h3' component='h1' textAlign='center'>
				Admin Dashboard
			</Typography>
			<Box sx={{ display: { xs: 'flex' }, alignItems: 'center' }}>
				<Button onClick={() => promoteToAdmin(String(id))}>Promote to Admin</Button>
				<Button onClick={() => demoteFromAdmin(String(id))}>Demote to User</Button>
				<Button onClick={() => blockUser(String(id))}>Block</Button>
				<Button onClick={() => unblockUser(String(id))}>Unblock</Button>
				<Button onClick={() => deleteUser(String(id))}>Delete</Button>
			</Box>

			<Paper sx={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					initialState={{ pagination: { paginationModel } }}
					pageSizeOptions={[5, 10, 25, 50]}
					checkboxSelection
					sx={{ border: 0 }}
				/>
			</Paper>
		</>
	);
};
