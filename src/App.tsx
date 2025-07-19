import React, { useState, useEffect } from 'react';
import { PenTool } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import ThemeSelector from './components/ThemeSelector';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { buildDirectoryTree, createPath } from './utils/pathUtils';
import { Note, Directory } from './types';

function App() {
  const { theme } = useTheme();
  const [notes, setNotes] = useLocalStorage<Note[]>('digital-garden-notes', []);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>('/');
  const [isEditing, setIsEditing] = useState(false);
  const [directoryTree, setDirectoryTree] = useState<Directory>({ 
    name: 'Root', 
    path: '/', 
    children: [], 
    notes: [] 
  });

  useEffect(() => {
    const tree = buildDirectoryTree(notes.map(note => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt)
    })));
    setDirectoryTree(tree);
  }, [notes]);

  const handleCreateNote = (path: string, type: 'blog' | 'note') => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: `New ${type}`,
      content: '',
      path,
      type,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes(prev => [...prev, newNote]);
    setCurrentNote(newNote);
    setIsEditing(true);
  };

  const handleCreateDirectory = (parentPath: string, name: string) => {
    // Directory creation is handled implicitly when notes are created in new paths
    const newPath = createPath(parentPath, name);
    setSelectedPath(newPath);
  };

  const handleSaveNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setCurrentNote(updatedNote);
    setIsEditing(false);
  };

  const handleNoteSelect = (note: Note) => {
    setCurrentNote(note);
    setSelectedPath(note.path);
    setIsEditing(false);
  };

  const handlePathSelect = (path: string) => {
    setSelectedPath(path);
    setCurrentNote(null);
    setIsEditing(false);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className={`h-screen flex ${theme.colors.bg}`}>
      <Sidebar
        directoryTree={directoryTree}
        selectedPath={selectedPath}
        currentNote={currentNote}
        onPathSelect={handlePathSelect}
        onNoteSelect={handleNoteSelect}
        onCreateNote={handleCreateNote}
        onCreateDirectory={handleCreateDirectory}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`${theme.colors.surface} border-b ${theme.colors.border} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PenTool size={24} className={theme.colors.accent.replace('bg-', 'text-')} />
              <div>
                <h1 className={`text-xl font-semibold ${theme.colors.text}`}>Digital Writing Garden</h1>
                <p className={`text-sm ${theme.colors.textMuted}`}>Your personal space for blogs and notes</p>
              </div>
            </div>
            <ThemeSelector />
          </div>
        </header>

        <Editor
          note={currentNote}
          isEditing={isEditing}
          onSave={handleSaveNote}
          onToggleEdit={handleToggleEdit}
        />
      </div>
    </div>
  );
}

export default App;