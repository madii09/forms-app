/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const deleteUserFromAuth = functions.https.onCall(
	async (request: functions.https.CallableRequest<{ uid: string }>) => {
		const { uid } = request.data;

		// Check if the user is authenticated
		if (!request.auth) {
			throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
		}

		// Check if the authenticated user is an admin by querying Firestore
		const currentUserDoc = await admin.firestore().collection('users').doc(request.auth.uid).get();

		if (!currentUserDoc.exists) {
			throw new functions.https.HttpsError(
				'not-found',
				'Current user document not found from firestore',
			);
		}

		const currentUserData = currentUserDoc.data();

		// Ensure the current user exists and is an admin
		if (!currentUserData || currentUserData.role !== 'admin') {
			throw new functions.https.HttpsError(
				'permission-denied',
				'Only admins can perform this action.',
			);
		}

		try {
			// Allow deletion of any user or themselves
			await admin.auth().deleteUser(uid);
			return { message: `Successfully deleted user: ${uid}` };
		} catch (error) {
			console.error('Error deleting user:', error);
			throw new functions.https.HttpsError('internal', (error as Error).message);
		}
	},
);
