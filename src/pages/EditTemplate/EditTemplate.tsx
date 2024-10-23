import { useNavigate, useParams } from 'react-router-dom';
import { useTemplate } from '../../hooks';
import { useEffect } from 'react';
import { Box, CircularProgress, Container } from '@mui/material';
import { TemplateForm, TemplateFormsCreateProps } from '../../components';
import { ROUTES } from '../../utils';

export const EditTemplate = () => {
	const { id } = useParams<{ id: string }>();
	const { getTemplateById, updateTemplate, loading, templates, error } = useTemplate();
	const navigate = useNavigate();

	const template = templates.find(template => template.id === id);

	const handleUpdateTemplate = async (data: TemplateFormsCreateProps) => {
		if (id) {
			await updateTemplate(id, data);
			navigate(ROUTES.home);
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
