import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Button,
	CircularProgress,
	Typography,
	TextField,
	FormControlLabel,
	Checkbox,
	Radio,
	RadioGroup,
	Container,
	Card,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { Responses, TemplateProps, useRequests } from '../../hooks';
import { ROUTES } from '../../utils';

export const RequestDetails = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [template, setTemplate] = useState<TemplateProps | null>(null);
	const [answers, setAnswers] = useState<Responses>({});
	const [loadingTemplate, setLoadingTemplate] = useState<boolean>(true);

	const { fetchTemplateByRequestId, submitRequest, loading } = useRequests();

	useEffect(() => {
		const fetchData = async () => {
			setLoadingTemplate(true);
			try {
				if (id) {
					const templateData = await fetchTemplateByRequestId(id);
					setTemplate(templateData);

					// Initialize answers state based on question type
					const initialAnswers: Responses = {};
					templateData?.questions.forEach(question => {
						initialAnswers[question.id] = question.type === 'checkbox' ? [] : '';
					});
					setAnswers(initialAnswers);
				}
			} catch (err) {
				console.error('Error fetching template:', err);
			}
			setLoadingTemplate(false);
		};

		fetchData();
	}, [fetchTemplateByRequestId, id]);

	const handleInputChange = (questionId: string, value: string | string[]) => {
		setAnswers(prevAnswers => ({
			...prevAnswers,
			[questionId]: value,
		}));
	};

	const handleSubmit = async () => {
		try {
			if (id) {
				setLoadingTemplate(true);
				await submitRequest(id, answers);
				navigate(ROUTES.home);
			}
		} catch (error) {
			console.error('Error submitting answers:', error);
			alert('Failed to submit answers. Please try again later.');
		} finally {
			setLoadingTemplate(false);
		}
	};

	if (loading || loadingTemplate) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Container maxWidth='md' sx={{ marginTop: 4 }}>
			<Card sx={{ padding: 4, boxShadow: 3 }}>
				{template ? (
					<>
						<Typography variant='h4' gutterBottom align='center' color='primary'>
							{template.title}
						</Typography>
						<Typography variant='body1' paragraph align='center'>
							{template.description}
						</Typography>
						<Typography variant='h6' gutterBottom>
							Questions
						</Typography>
						<Box sx={{ marginTop: 2 }}>
							{template.questions.map(question => (
								<Paper key={question.id} sx={{ padding: 2, marginBottom: 2, boxShadow: 2 }}>
									<Typography variant='subtitle1' sx={{ marginBottom: 1 }}>
										{question.text}
									</Typography>
									{question.type === 'text' && (
										<TextField
											fullWidth
											variant='outlined'
											value={answers[question.id]}
											onChange={e => handleInputChange(question.id, e.target.value)}
										/>
									)}
									{question.type === 'radio' && (
										<RadioGroup
											value={answers[question.id]}
											onChange={e => handleInputChange(question.id, e.target.value)}
										>
											{question.options.map(option => (
												<FormControlLabel
													key={option}
													value={option}
													control={<Radio />}
													label={option}
												/>
											))}
										</RadioGroup>
									)}
									{question.type === 'checkbox' &&
										question.options.map(option => (
											<FormControlLabel
												key={option}
												control={
													<Checkbox
														checked={answers[question.id].includes(option)}
														onChange={e => {
															const selectedOptions = answers[question.id];
															if (e.target.checked) {
																handleInputChange(question.id, [...selectedOptions, option]);
															} else {
																handleInputChange(
																	question.id,
																	(selectedOptions as string[]).filter(
																		(opt: string) => opt !== option,
																	),
																);
															}
														}}
													/>
												}
												label={option}
											/>
										))}
								</Paper>
							))}
						</Box>
						<Button
							variant='contained'
							color='primary'
							onClick={handleSubmit}
							sx={{
								marginTop: 3,
								width: '100%',
								padding: '10px 0',
								fontSize: '1.1rem',
								'&:hover': {
									backgroundColor: 'primary.dark',
								},
							}}
							disabled={loadingTemplate}
						>
							Submit Answers
						</Button>
					</>
				) : (
					<Typography color='error' align='center'>
						Template not found or an error occurred.
					</Typography>
				)}
			</Card>
		</Container>
	);
};
