import { TemplateProps } from '../../useTemplate/types';

export interface RequestProps {
	id: string;
	templateId: string;
	userId: string;
	status: 'pending' | 'submitted';
	assignedAt: string;
	templateTitle: string;
}

export type Responses = {
	[questionId: string]: string | string[]; // string for 'text' and 'radio', string[] for 'checkbox'
};

export interface UseRequestsResult {
	requests: RequestProps[];
	loading: boolean;
	error: string | null;
	fetchTemplateByRequestId: (requestId: string) => Promise<TemplateProps | null>;
	submitRequest: (requestId: string, responses: Responses) => Promise<void>;
	createTemplateRequests: (
		templateId: string,
		selectedUserIds: string[],
		ownerId: string,
	) => Promise<void>;
	countPendingRequests: () => Promise<number>;
}
