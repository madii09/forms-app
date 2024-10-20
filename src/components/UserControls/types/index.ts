import { GridRowId } from '@mui/x-data-grid';
import { UseAdminResult } from '../../../hooks';

export interface UserControlsProps {
	selectedUsers: GridRowId[];
	onControlUsers: (controlType: keyof UseAdminResult) => void;
}
