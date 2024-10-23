import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Container } from '@mui/material';
import { TemplateForm, TemplateFormsCreateProps } from '../../components';
import { useRequests, useTemplate } from '../../hooks';
import { ROUTES } from '../../utils';

export const EditTemplate = () => {
	const { id } = useParams<{ id: string }>();
	const { getTemplateById, updateTemplate, loading, templates, error } = useTemplate();
	const { createTemplateRequests } = useRequests();

	const navigate = useNavigate();

	const template = templates.find(template => template.id === id);

	const handleUpdateTemplate = async (data: TemplateFormsCreateProps) => {
		try {
			if (id) {
				await updateTemplate(id, data);

				if (data.allowedUsers && data.allowedUsers.length > 0) {
					await createTemplateRequests(id, data.allowedUsers, data.authorId);
				}

				navigate(ROUTES.home);
			}
		} catch (err) {
			console.error('Error updating template:', err);
		}
	};

	useEffect(() => {
		if (id) getTemplateById(id);
	}, [id, getTemplateById]);

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
				<CircularProgress />
			</Box>
		);
	}
	if (error) return <p>Error loading template.</p>;

	return (
		<Container maxWidth='sm'>
			<TemplateForm onSubmit={handleUpdateTemplate} loading={loading} initialValues={template} />
		</Container>
	);
};
