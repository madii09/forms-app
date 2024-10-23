import { useState, ChangeEvent } from 'react';
import {
	Box,
	Button,
	TextField,
	Divider,
	Chip,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddFieldProps } from './types';
import { QuestionProps, QuestionType } from '../../hooks';

export const AddFields = ({ onChange, initialQuestions }: AddFieldProps) => {
	const [question, setQuestion] = useState('');
	const [optionType, setOptionType] = useState<QuestionType>('radio');
	const [options, setOptions] = useState<string[]>([]);
	const [questions, setQuestions] = useState<QuestionProps[]>(initialQuestions || []);

	const handleAddOption = () => setOptions([...options, '']);

	const handleOptionChange = (index: number, value: string) => {
		const updatedOptions = [...options];
		updatedOptions[index] = value;
		setOptions(updatedOptions);
	};

	const handleAddQuestion = () => {
		if (question && (optionType === 'text' || options.length > 0)) {
			const newQuestion: QuestionProps = {
				id: crypto.randomUUID(),
				text: question,
				type: optionType,
				options: optionType === 'text' ? [] : options,
			};
			const updatedQuestions = [...questions, newQuestion];
			setQuestions(updatedQuestions);
			onChange(updatedQuestions); // Provide the updated list to the prop function
			setQuestion('');
			setOptions([]);
			setOptionType('radio'); // Reset to default
		}
	};

	const handleRemoveQuestion = (id: string) => {
		const updatedQuestions = questions.filter(q => q.id !== id);
		setQuestions(updatedQuestions);
		onChange(updatedQuestions); // Update the prop function with the modified list
	};

	return (
		<Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 2, margin: 3 }}>
			<Divider>
				<Chip label='Form fields' size='small' />
			</Divider>

			<List>
				{questions.map(q => (
					<ListItem
						key={q.id}
						sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
					>
						<ListItemText
							primary={q.text}
							secondary={
								q.type === 'text'
									? 'Text Field'
									: `${q.type === 'radio' ? 'Select' : 'Multi Select'} - ${q.options.join(', ')}`
							}
						/>
						<Box>
							<IconButton edge='end' onClick={() => handleRemoveQuestion(q.id)}>
								<DeleteIcon />
							</IconButton>
						</Box>
					</ListItem>
				))}
			</List>

			<TextField
				label='Question'
				value={question}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
				fullWidth
				variant='outlined'
			/>

			<FormControl fullWidth>
				<InputLabel>Option Type</InputLabel>
				<Select
					value={optionType}
					onChange={e => setOptionType(e.target.value as QuestionType)}
					variant='outlined'
				>
					<MenuItem value='radio'>Select</MenuItem>
					<MenuItem value='checkbox'>Multi Select</MenuItem>
					<MenuItem value='text'>Text Field</MenuItem>
				</Select>
			</FormControl>

			{optionType !== 'text' && (
				<>
					{options.map((option, index) => (
						<TextField
							key={index}
							label={`Option ${index + 1}`}
							value={option}
							onChange={e => handleOptionChange(index, e.target.value)}
							fullWidth
							variant='outlined'
							sx={{ marginBottom: 1 }}
						/>
					))}

					<Button onClick={handleAddOption} variant='outlined'>
						Add Option
					</Button>
				</>
			)}

			<Button onClick={handleAddQuestion} variant='outlined'>
				Add Question
			</Button>
		</Box>
	);
};
