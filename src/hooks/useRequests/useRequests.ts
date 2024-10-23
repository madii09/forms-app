import { useState, useEffect, useCallback } from 'react';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	updateDoc,
	addDoc,
	Timestamp,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../useAuth/useAuth';
import { TemplateProps } from '../useTemplate/types';
import { RequestProps, Responses, UseRequestsResult } from './types';

export const useRequests = (): UseRequestsResult => {
	const { currentUser } = useAuth();
	const [requests, setRequests] = useState<RequestProps[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const countPendingRequests = useCallback(async (): Promise<number> => {
		if (!currentUser) return 0;

		const q = query(
			collection(db, 'templateRequests'),
			where('userId', '==', currentUser.uid),
			where('status', '==', 'pending'),
		);

		const snapshot = await getDocs(q);
		return snapshot.size; // Return the count of pending requests
	}, [currentUser]);

	const fetchRequestsForUser = useCallback(async () => {
		if (!currentUser) return;

		setLoading(true);
		setError(null);

		try {
			const q = query(
				collection(db, 'templateRequests'),
				where('userId', '==', currentUser.uid),
				where('status', '==', 'pending'),
			);

			const snapshot = await getDocs(q);
			const fetchedRequests = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			})) as RequestProps[];

			setRequests(fetchedRequests);
		} catch (err) {
			console.error('Error fetching requests:', err);
			setError('Failed to fetch requests. Please try again.');
		} finally {
			setLoading(false);
		}
	}, [currentUser]);

	const fetchTemplateByRequestId = useCallback(
		async (requestId: string): Promise<TemplateProps | null> => {
			try {
				const requestDoc = await getDoc(doc(db, 'templateRequests', requestId));
				const requestData = requestDoc.data();

				if (requestData) {
					const templateDoc = await getDoc(doc(db, 'templates', requestData.templateId));
					return templateDoc.exists() ? (templateDoc.data() as TemplateProps) : null;
				}
			} catch (err) {
				console.error('Error fetching template:', err);
				setError('Failed to load template.');
			}
			return null;
		},
		[],
	);

	const submitRequest = useCallback(async (requestId: string, responses: Responses) => {
		try {
			const requestRef = doc(db, 'templateRequests', requestId);
			await updateDoc(requestRef, {
				status: 'submitted',
				responses,
				submittedAt: Timestamp.now(),
			});

			setRequests(prev => prev.filter(request => request.id !== requestId));
		} catch (err) {
			console.error('Error submitting request:', err);
			setError('Failed to submit request. Please try again.');
		}
	}, []);

	const createTemplateRequests = useCallback(
		async (templateId: string, selectedUserIds: string[], ownerId: string) => {
			try {
				const requestsCollection = collection(db, 'templateRequests');

				const batchPromises = selectedUserIds.map(userId =>
					addDoc(requestsCollection, {
						templateId,
						userId,
						ownerId,
						status: 'pending',
						requestedAt: Timestamp.now(),
					}),
				);

				await Promise.all(batchPromises);
				console.log('Requests created successfully');
			} catch (err) {
				console.error('Error creating template requests:', err);
				setError('Failed to create template requests.');
			}
		},
		[],
	);

	useEffect(() => {
		if (currentUser) {
			fetchRequestsForUser();
		}
	}, [currentUser, fetchRequestsForUser]);

	return {
		requests,
		loading,
		error,
		fetchTemplateByRequestId,
		submitRequest,
		createTemplateRequests,
		countPendingRequests,
	};
};
