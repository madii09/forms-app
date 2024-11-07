import axios from "axios";
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { GetTicketsRequestData, JiraIssue, JiraTicketData } from './types';

admin.initializeApp();

const JIRA_DOMAIN = process.env.JIRA_DOMEN;
const JIRA_API_TOKEN = process.env.JIRA_TOKEN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

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

export const createJiraTicket = functions.https.onCall(
  async (request: functions.https.CallableRequest<JiraTicketData>) => {
    const { summary, priority, templateTitle, link, reportedBy } = request.data;
    const createJiraTicketPayload = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary,
        priority: { name: priority },
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: `Reported by: ${reportedBy}` },
              ]
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: `Template: ${templateTitle}` },
              ]
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: `Link: ${link}` },
              ]
            }
          ]
        },
        issuetype: { name: "Task" },
      }
    };

    try {
      const response = await axios.post(`${JIRA_DOMAIN}/rest/api/3/issue`,
        createJiraTicketPayload,
        {
          auth: {
            username: JIRA_EMAIL as string,
            password: JIRA_API_TOKEN as string,
          },
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
            ).toString("base64")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          }
        }
      );

      return { success: true, ticketUrl: `${JIRA_DOMAIN}/browse/${response.data.key}` };
    } catch (error) {
      throw new functions.https.HttpsError("internal", "Failed to create Jira ticket", (error as Record<string, Record<string, string>>).response?.data || (error as Record<string, string>).message);
    }
  }
);

export const getJiraTickets = functions.https.onCall(
  async (
    request: functions.https.CallableRequest<GetTicketsRequestData>
  ): Promise<{ issues: JiraIssue[] }> => {
    const { userEmail } = request.data;

    if (!userEmail) {
      throw new functions.https.HttpsError('invalid-argument', 'User email is required');
    }

    const JIRA_API_URL = `${JIRA_DOMAIN}/rest/api/3/search`;
    const jqlQuery = `reporter = "${userEmail}"`; // Fetch issues created by the user
    const url = `${JIRA_API_URL}?jql=${encodeURIComponent(jqlQuery)}`;

    try {
      const response = await axios.get<{ issues: JiraIssue[] }>(url, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
          'Accept': 'application/json',
        },
      });

      const issues = response.data.issues;

      // Return the issues to the client
      return { issues };
    } catch (error) {
      throw new functions.https.HttpsError(
        'internal',
        'Failed to fetch Jira tickets',
        (error as Record<string, Record<string, string>>).response?.data || (error as Record<string, string>).message
      );
    }
  }
);

