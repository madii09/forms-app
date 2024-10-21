import { TemplateProps } from '../../../hooks';

export type TemplateFormsCreateProps = Omit<TemplateProps, 'id' | 'createdAt' | 'authorId'>;

export interface TemplateFormProps {
	onCreate: (props: TemplateFormsCreateProps) => void;
	loading: boolean;
}
