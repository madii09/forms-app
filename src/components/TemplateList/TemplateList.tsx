import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
	Box,
	Card,
	CardContent,
	Typography,
	IconButton,
	CircularProgress,
	TextField,
	Divider,
	Grid2,
	Button,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useTemplate } from '../../hooks';
import { MAX_DESCRIPTION_LENGTH, ROUTES } from '../../utils';
import Link from '@mui/material/Link';

export const TemplateList: React.FC = () => {
	const { templates, loading, error, fetchTemplates, deleteTemplate, updateTemplate } =
		useTemplate();

	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filteredTemplates, setFilteredTemplates] = useState(templates);

	useEffect(() => {
		fetchTemplates(); // Fetch templates on component mount
	}, [fetchTemplates]);

	useEffect(() => {
		const lowerCasedTerm = searchTerm.toLowerCase();
		const filtered = templates.filter(
			template =>
				template.title.toLowerCase().includes(lowerCasedTerm) ||
				template.description.toLowerCase().includes(lowerCasedTerm) ||
				template.topic.toLowerCase().includes(lowerCasedTerm) ||
				template.tags.some(tag => tag.toLowerCase().includes(lowerCasedTerm)),
		);
		setFilteredTemplates(filtered);
	}, [searchTerm, templates]);

	const handleDelete = (id: string) => {
		deleteTemplate(id);
	};

	const handleTogglePublic = (id: string, isPublic: boolean) => {
		updateTemplate(id, { isPublic: !isPublic });
	};

	const truncateDescription = (description: string) =>
		description.length > MAX_DESCRIPTION_LENGTH
			? `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
			: description;

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Typography color='error' sx={{ textAlign: 'center', marginTop: 4 }}>
				{error}
			</Typography>
		);
	}

	return (
		<Box>
			<TextField
				label='Search Templates'
				variant='outlined'
				sx={{ width: '350px', margin: '1.5rem 0' }}
				value={searchTerm}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
				placeholder='Search by title, description'
			/>

			{filteredTemplates.length === 0 ? (
				<Typography variant='h6' sx={{ textAlign: 'center', marginTop: 4 }}>
					No templates found.
				</Typography>
			) : (
				<Grid2 container spacing={5} sx={{ marginTop: 4 }}>
					{filteredTemplates.map(template => (
						<Grid2 key={template.id}>
							<Card
								sx={{ height: '100%', width: '350px', display: 'flex', flexDirection: 'column' }}
							>
								<CardContent sx={{ flex: 1 }}>
									<RouterLink to={ROUTES.templateInfo.link + template.id}>
										<Link component='h5' variant='h5' color='primary' gutterBottom>
											{template.title}
										</Link>
									</RouterLink>
									<Typography variant='body2' color='textSecondary' sx={{ marginBottom: 2 }}>
										{truncateDescription(template.description)}
									</Typography>
									<Typography variant='subtitle2' sx={{ marginBottom: 2 }}>
										Topic: {template.topic}
									</Typography>
									<Typography variant='caption' sx={{ display: 'block', marginBottom: 2 }}>
										Tags: {template.tags.join(', ')}
									</Typography>
									<Typography variant='caption' sx={{ display: 'block', marginBottom: 2 }}>
										Public: {template.isPublic ? 'Yes' : 'No'}
									</Typography>
								</CardContent>

								<Divider />

								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										padding: 2,
										marginTop: 'auto',
									}}
								>
									<Button
										variant='outlined'
										color={template.isPublic ? 'warning' : 'success'}
										onClick={() => handleTogglePublic(template.id, template.isPublic)}
									>
										{template.isPublic ? 'Make Private' : 'Make Public'}
									</Button>

									<div>
										<IconButton
											color='primary'
											onClick={() => navigate(ROUTES.editTemplate.link + template.id)}
										>
											<Edit />
										</IconButton>

										<IconButton
											color='error'
											onClick={() => handleDelete(template.id)}
											aria-label='Delete Template'
										>
											<Delete />
										</IconButton>
									</div>
								</Box>
							</Card>
						</Grid2>
					))}
				</Grid2>
			)}
		</Box>
	);
};
