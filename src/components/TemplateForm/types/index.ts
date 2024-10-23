import { TemplateProps } from '../../../hooks';

export type TemplateFormsCreateProps = Omit<TemplateProps, 'id' | 'createdAt' | 'authorId'>;

export interface TemplateFormProps {
	onSubmit: (props: TemplateFormsCreateProps) => void;
	loading: boolean;
	initialValues?: TemplateFormsCreateProps;
}
