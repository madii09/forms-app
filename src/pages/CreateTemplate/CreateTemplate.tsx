import { Container } from '@mui/material';
import { TemplateForm, TemplateFormsCreateProps } from '../../components';
import { useAuth, useTemplate } from '../../hooks';
import { ROUTES } from '../../utils';
import { useNavigate } from 'react-router-dom';

export const CreateTemplate = () => {
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const { loading, createTemplate, error } = useTemplate();

	const handleCreateTemplate = async ({
		title,
		description,
		topic,
		tags,
		isPublic,
		questions,
		allowedUsers,
	}: TemplateFormsCreateProps) => {
		await createTemplate({
			title,
			description,
			topic,
			tags,
			isPublic,
			authorId: currentUser?.uid || '',
			questions,
			allowedUsers: allowedUsers ? allowedUsers : [],
		}).then(() => navigate(ROUTES.home));
	};

	return (
		<Container maxWidth='sm'>
			{error && <p>{error}</p>}
			<TemplateForm onSubmit={handleCreateTemplate} loading={loading} />
		</Container>
	);
};
