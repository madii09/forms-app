import { useState, useCallback } from 'react';
import {
	collection,
	addDoc,
	getDocs,
	getDoc,
	updateDoc,
	deleteDoc,
	doc,
	Timestamp,
	DocumentData,
	QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../useAuth/useAuth.ts';
import { AnswerProps, TemplateProps, UseTemplateResult } from './types';

export const useTemplate = (): UseTemplateResult => {
	const [templates, setTemplates] = useState<TemplateProps[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const { currentUser } = useAuth();

	const fetchTemplates = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collection(db, 'templates'));
			const templatesData: TemplateProps[] = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			})) as TemplateProps[];
			setTemplates(
				currentUser ? templatesData : templatesData.filter(template => template.isPublic),
			);
		} catch (err) {
			setError('Failed to fetch templates');
			console.error('Error fetching templates:', err);
		} finally {
			setLoading(false);
		}
	}, [currentUser]);

	const getTemplateById = useCallback(
		async (id: string) => {
			setLoading(true);
			setError(null);
			try {
				const docSnapshot = await getDoc(doc(db, 'templates', id));
				if (docSnapshot.exists()) {
					const fetchedTemplate = { id: docSnapshot.id, ...docSnapshot.data() } as TemplateProps;

					// Handle access restriction for unauthenticated users
					if (!currentUser && !fetchedTemplate.isPublic) {
						setError('Template is not accessible.');
						return;
					}

					// Replace the templates state with the fetched template
					setTemplates([fetchedTemplate]);
				} else {
					setError('Template not found.');
				}
			} catch (err) {
				setError('Failed to fetch template');
				console.error('Error fetching template:', err);
			} finally {
				setLoading(false);
			}
		},
		[currentUser],
	);

	const createTemplate = async (template: Omit<TemplateProps, 'id' | 'createdAt'>) => {
		setLoading(true);
		setError(null);
		try {
			const newTemplate = {
				...template,
				createdAt: Timestamp.fromDate(new Date()),
			};
			return (await addDoc(collection(db, 'templates'), newTemplate)) as { id: string };
		} catch (err) {
			setError('Failed to create template');
			console.error('Error creating template:', err);
		} finally {
			setLoading(false);
		}
	};

	const updateTemplate = async (id: string, data: Partial<TemplateProps>) => {
		setLoading(true);
		setError(null);
		try {
			const templateDoc = doc(db, 'templates', id);
			await updateDoc(templateDoc, data);
			await fetchTemplates(); // Refresh the list after updating
		} catch (err) {
			setError('Failed to update template');
			console.error('Error updating template:', err);
		} finally {
			setLoading(false);
		}
	};

	const deleteTemplate = async (id: string) => {
		setLoading(true);
		setError(null);
		try {
			const templateDoc = doc(db, 'templates', id);
			await deleteDoc(templateDoc);
			setTemplates(prev => prev.filter(template => template.id !== id));
		} catch (err) {
			setError('Failed to delete template');
			console.error('Error deleting template:', err);
		} finally {
			setLoading(false);
		}
	};

	const submitResponse = async (templateId: string, answers: AnswerProps[]) => {
		setLoading(true);
		setError(null);
		try {
			const response = {
				templateId,
				userId: currentUser?.uid,
				answers,
				submittedAt: Timestamp.fromDate(new Date()),
			};
			await addDoc(collection(db, 'responses'), response);
		} catch (err) {
			setError('Failed to submit response');
			console.error('Error submitting response:', err);
		} finally {
			setLoading(false);
		}
	};

	return {
		templates,
		loading,
		error,
		createTemplate,
		updateTemplate,
		deleteTemplate,
		fetchTemplates,
		getTemplateById,
		submitResponse,
	};
};
