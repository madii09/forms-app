import { UserDataProps } from '../../../hooks';
import { GridCallbackDetails, GridRowSelectionModel } from '@mui/x-data-grid';

export interface UserListTableProps {
	users: UserDataProps[];
	onRowSelection: (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => void;
}
