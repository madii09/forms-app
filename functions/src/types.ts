export interface JiraTicketData {
  summary: string;
  priority: "Highest" | "High" | "Medium" | "Low" | "Lowest";
  templateTitle?: string;
  link: string;
  reportedBy: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
  };
}

export interface GetTicketsRequestData {
  userEmail: string;
}