export interface Note {
  id: string;
  title: string;
  content: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  type: 'blog' | 'note';
}

export interface Directory {
  name: string;
  path: string;
  children: Directory[];
  notes: Note[];
}

export interface AppState {
  notes: Note[];
  directories: Directory[];
  currentNote: Note | null;
  selectedPath: string;
  isEditing: boolean;
}