export interface Note {
  id: string;
  folderId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string | null; // YYYY-MM-DD format for date-based tasks
  list?: string; // name of the custom list for non-date-based tasks
}

export type DropLocation = { date: string | null; list?: string };
