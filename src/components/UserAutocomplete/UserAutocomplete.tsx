import { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { getDocs, collection } from 'firebase/firestore';
import { UserDataProps } from '../../hooks';
import { db } from '../../services/firebase';
import { UserAutocompleteProps } from './types';

export const UserAutocomplete = ({
	onUsersChange,
	initiallySelectedUsers,
}: UserAutocompleteProps) => {
	const [users, setUsers] = useState<UserDataProps[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<UserDataProps[]>([]);

	const fetchUsers = useCallback(async () => {
		setUsers([]);
		const querySnapshot = await getDocs(collection(db, 'users'));
		const usersList = querySnapshot.docs.map(doc => ({
			uid: doc.id,
			...doc.data(),
		})) as UserDataProps[];

		setUsers(usersList);

		if (initiallySelectedUsers && initiallySelectedUsers.length > 0) {
			setSelectedUsers(usersList.filter(user => initiallySelectedUsers.includes(user.uid)));
		}
	}, [initiallySelectedUsers]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return (
		<Autocomplete
			multiple
			options={users}
			sx={{ width: '100%' }}
			getOptionLabel={option => `${option.username} (${option.email})`}
			value={selectedUsers}
			onChange={(_, newValue) => {
				setSelectedUsers(newValue);
				onUsersChange(newValue);
			}}
			renderTags={(tagValue, getTagProps) =>
				tagValue.map((option, index) => (
					<Chip
						{...getTagProps({ index })}
						key={option.uid}
						label={`${option.username} (${option.email})`}
					/>
				))
			}
			renderInput={params => (
				<TextField {...params} label='Select Users' placeholder='Search users...' />
			)}
		/>
	);
};
