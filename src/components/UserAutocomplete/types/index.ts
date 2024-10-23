import { UserDataProps } from '../../../hooks';

export interface UserAutocompleteProps {
	initiallySelectedUsers?: UserDataProps['uid'][];
	onUsersChange: (users: UserDataProps[]) => void;
}
