import { QuestionProps } from '../../../hooks';

export interface AddFieldProps {
	onChange: (questions: QuestionProps[]) => void;
	initialQuestions?: QuestionProps[];
}
