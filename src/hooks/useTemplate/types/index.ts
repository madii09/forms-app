export interface TemplateProps {
	id: string;
	title: string;
	description: string;
	topic: string;
	authorId: string;
	tags: string[];
	isPublic: boolean;
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
}
