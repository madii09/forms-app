import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import Typography from '@mui/material/Typography';
import { GridRowId } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { useAdmin, UseAdminResult, useAuth, UserDataProps } from '../../hooks';
import { UserControls, UserListTable } from '../../components';
import { db } from '../../services/firebase';
import { ROUTES } from '../../utils';

export const AdminDashboard: React.FC = () => {
	const [users, setUsers] = useState<UserDataProps[]>([]);
	const [selectedUsersIds, setSelectedUsersIds] = useState<GridRowId[]>([]);

	const navigate = useNavigate();
	const { currentUser, isUserAdmin } = useAuth();
	const userControls = useAdmin();

	const fetchUsers = async () => {
		setUsers([]);
		const querySnapshot = await getDocs(collection(db, 'users'));
		const usersList = querySnapshot.docs.map(doc => ({
			uid: doc.id,
			...doc.data(),
		}));
		setUsers(usersList as UserDataProps[]);
	};

	const onControlUsers = async (controlType: keyof UseAdminResult) => {
		await userControls[controlType](selectedUsersIds.map(u => String(u)));
		fetchUsers().catch(error => console.log('error on fetching users', error));
	};

	useEffect(() => {
		if (isUserAdmin) fetchUsers();
	}, [isUserAdmin]);

	useEffect(() => {
		if (!currentUser || !isUserAdmin) {
			navigate(ROUTES.home);
		}
	}, [currentUser, isUserAdmin, navigate]);

	return (
		<Box sx={{ padding: '1.5rem' }}>
			<Typography variant='h4' component='h1' color='primary'>
				Admin Dashboard
			</Typography>

			<UserControls selectedUsers={selectedUsersIds} onControlUsers={onControlUsers} />

			<UserListTable
				users={users}
				onRowSelection={rowSelectionModel => {
					setSelectedUsersIds([...rowSelectionModel]);
				}}
			/>
		</Box>
	);
};
