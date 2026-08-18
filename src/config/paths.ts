export const paths = {
  dashboard: "/",
  workflows: "/workflows",
  tasks: "/tasks",
  events: "/events",
  acts: "/acts",
  documents: {
    root: "/documents",
    detail: "/documents/:documentId",
    getHref: (documentId: string) => `/documents/${encodeURIComponent(documentId)}`,
  },
  settings: "/settings",
} as const;
