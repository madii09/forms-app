import { TemplateProps } from '../../useTemplate/types';

export interface RequestProps {
	id: string;
	ownerId: string;
	templateId: string;
	userId: string;
	status: 'pending' | 'submitted';
	responses: Responses;
	assignedAt?: { seconds: number; nanoseconds: number };
	submittedAt?: { seconds: number; nanoseconds: number };
	requestedAt?: { seconds: number; nanoseconds: number };
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
	fetchSubmittedRequestsByTemplateId: (
		templateID: string,
		ownerID: string,
	) => Promise<{ template: TemplateProps | null; requests: RequestProps[] }>;
	submitRequest: (requestId: string, responses: Responses) => Promise<void>;
	createTemplateRequests: (
		templateId: string,
		selectedUserIds: string[],
		ownerId: string,
	) => Promise<void>;
	countPendingRequests: () => Promise<number>;
}
