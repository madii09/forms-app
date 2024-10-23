import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
	Box,
	TextField,
	Button,
	Typography,
	FormControl,
	FormLabel,
	FormHelperText,
	Checkbox,
	FormControlLabel,
} from '@mui/material';
import { TemplateFormProps } from './types';
import { QuestionProps, useAuth } from '../../hooks';
import { AddFields } from '../AddFields/AddFields';
import { UserAutocomplete } from '../UserAutocomplete/UserAutocomplete';

export const TemplateForm = ({ onSubmit, loading, initialValues }: TemplateFormProps) => {
	const [title, setTitle] = useState(initialValues?.title || '');
	const [description, setDescription] = useState(initialValues?.description || '');
	const [topic, setTopic] = useState(initialValues?.topic || '');
	const [tags, setTags] = useState(initialValues?.tags.join(', ') || '');
	const [isPublic, setIsPublic] = useState(initialValues?.isPublic || false);
	const [questions, setQuestions] = useState<QuestionProps[]>(initialValues?.questions || []);
	const [selectedUsers, setSelectedUsers] = useState<string[]>(initialValues?.allowedUsers || []);

	const { currentUser } = useAuth();

	const [titleError, setTitleError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);
	const [topicError, setTopicError] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const validateInputs = (): boolean => {
		let valid = true;
		setTitleError(false);
		setDescriptionError(false);
		setTopicError(false);
		setErrorMessage(null);

		if (!title) {
			setTitleError(true);
			valid = false;
			setErrorMessage('Title is required.');
		}
		if (!description) {
			setDescriptionError(true);
			valid = false;
			setErrorMessage('Description is required.');
		}
		if (!topic) {
			setTopicError(true);
			valid = false;
			setErrorMessage('Topic is required.');
		}

		return valid;
	};

	const handleChange =
		(setter: React.Dispatch<React.SetStateAction<string>>) =>
		(event: ChangeEvent<HTMLInputElement>) =>
			setter(event.target.value);

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (validateInputs()) {
			onSubmit({
				title,
				description,
				topic,
				tags: tags.split(',').map(tag => tag.trim()),
				isPublic,
				questions,
				allowedUsers: selectedUsers,
				authorId: currentUser?.uid || '',
			});

			setTitle('');
			setDescription('');
			setTopic('');
			setTags('');
			setIsPublic(false);
			setQuestions([]);
			setSelectedUsers([]);
		}
	};

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
			noValidate
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				gap: 2,
				alignItems: 'center',
				margin: '1.5rem 0',
			}}
		>
			<Typography component='h1' variant='h4' color='primary' sx={{ textAlign: 'center' }}>
				{initialValues ? 'Update Template' : 'Create a New Template'}
			</Typography>

			<UserAutocomplete
				initiallySelectedUsers={selectedUsers}
				onUsersChange={users => setSelectedUsers(users.map(u => u.uid))}
			/>

			<FormControl fullWidth error={titleError}>
				<FormLabel htmlFor='title'>Title</FormLabel>
				<TextField
					id='title'
					placeholder='Enter template title'
					value={title}
					onChange={handleChange(setTitle)}
					variant='outlined'
					required
				/>
				{titleError && <FormHelperText>Title is required.</FormHelperText>}
			</FormControl>

			<FormControl fullWidth error={descriptionError}>
				<FormLabel htmlFor='description'>Description</FormLabel>
				<TextField
					id='description'
					placeholder='Enter template description'
					value={description}
					onChange={handleChange(setDescription)}
					variant='outlined'
					multiline
					rows={4}
					required
				/>
				{descriptionError && <FormHelperText>Description is required.</FormHelperText>}
			</FormControl>

			<FormControl fullWidth error={topicError}>
				<FormLabel htmlFor='topic'>Topic</FormLabel>
				<TextField
					id='topic'
					placeholder='Enter topic'
					value={topic}
					onChange={handleChange(setTopic)}
					variant='outlined'
					required
				/>
				{topicError && <FormHelperText>Topic is required.</FormHelperText>}
			</FormControl>

			<FormControl fullWidth>
				<FormLabel htmlFor='tags'>Tags</FormLabel>
				<TextField
					id='tags'
					placeholder='Enter tags separated by commas (e.g., UI, UX, React)'
					value={tags}
					onChange={handleChange(setTags)}
					variant='outlined'
				/>
			</FormControl>

			<AddFields initialQuestions={questions} onChange={questions => setQuestions(questions)} />

			<FormControlLabel
				control={
					<Checkbox
						checked={isPublic}
						onChange={e => setIsPublic(e.target.checked)}
						color='primary'
					/>
				}
				label='Make this template public'
			/>

			{errorMessage && (
				<Typography color='error' sx={{ textAlign: 'center' }}>
					{errorMessage}
				</Typography>
			)}

			<Button
				type='submit'
				variant='contained'
				color='primary'
				disabled={loading}
				sx={{ width: '100%' }}
			>
				{loading ? 'Submitting...' : initialValues ? 'Update Template' : 'Create Template'}
			</Button>
		</Box>
	);
};
