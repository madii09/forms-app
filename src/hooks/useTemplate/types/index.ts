export type QuestionType = 'radio' | 'checkbox' | 'text';

export interface QuestionProps {
	id: string;
	text: string;
	type: QuestionType;
	options: string[];
}

export interface AnswerProps {
	questionId: string;
	selectedOption: string;
}

export interface TemplateProps {
	id: string;
	title: string;
	description: string;
	topic: string;
	authorId: string;
	tags: string[];
	isPublic: boolean;
	questions: QuestionProps[];
	allowedUsers?: string[];
	createdAt: Date;
}

export interface UseTemplateResult {
	templates: TemplateProps[];
	loading: boolean;
	error: string | null;
	createTemplate: (template: Omit<TemplateProps, 'id' | 'createdAt'>) => Promise<void>;
	updateTemplate: (id: string, data: Partial<TemplateProps>) => Promise<void>;
	deleteTemplate: (id: string) => Promise<void>;
	fetchTemplates: () => Promise<void>;
	getTemplateById: (id: string) => Promise<void>;
	submitResponse: (templateId: string, answers: AnswerProps[]) => Promise<void>;
}
