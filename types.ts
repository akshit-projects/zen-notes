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