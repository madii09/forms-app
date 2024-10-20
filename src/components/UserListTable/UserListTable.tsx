import { useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { UserListTableProps } from './types';

export const UserListTable = ({ users, onRowSelection }: UserListTableProps) => {
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
			<Typography variant='h6' color='primary'>
				Users List
			</Typography>
			<Paper sx={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					initialState={{ pagination: { paginationModel } }}
					pageSizeOptions={[5, 10, 25, 50]}
					checkboxSelection
					onRowSelectionModelChange={onRowSelection}
				/>
			</Paper>
		</>
	);
};
