import { Container } from '@mui/material';
import { TemplateForm, TemplateFormsCreateProps } from '../../components';
import { useAuth, useRequests, useTemplate } from '../../hooks';
import { ROUTES } from '../../utils';
import { useNavigate } from 'react-router-dom';

export const CreateTemplate = () => {
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const { loading, createTemplate, error } = useTemplate();
	const { createTemplateRequests } = useRequests();

	const handleCreateTemplate = async (data: TemplateFormsCreateProps) => {
		try {
			const template = await createTemplate({
				...data,
				authorId: currentUser?.uid || '',
				allowedUsers: data.allowedUsers ? data.allowedUsers : [],
			});

			if (template && data.allowedUsers && data.allowedUsers.length > 0) {
				await createTemplateRequests(template.id, data.allowedUsers, currentUser?.uid || '');
			}

			navigate(ROUTES.home);
		} catch (err) {
			console.error('Error creating template:', err);
		}
	};

	return (
		<Container maxWidth='sm'>
			{error && <p>{error}</p>}
			<TemplateForm onSubmit={handleCreateTemplate} loading={loading} />
		</Container>
	);
};
