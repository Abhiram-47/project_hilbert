import React, { useState } from 'react';
import { 
  FolderOpen, 
  Folder, 
  FileText, 
  Plus, 
  Edit3,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Directory, Note } from '../types';
import { useTheme } from '../hooks/useTheme';

interface SidebarProps {
  directoryTree: Directory;
  selectedPath: string;
  currentNote: Note | null;
  onPathSelect: (path: string) => void;
  onNoteSelect: (note: Note) => void;
  onCreateNote: (path: string, type: 'blog' | 'note') => void;
  onCreateDirectory: (parentPath: string, name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  directoryTree,
  selectedPath,
  currentNote,
  onPathSelect,
  onNoteSelect,
  onCreateNote,
  onCreateDirectory
}) => {
  const { theme } = useTheme();
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['/']));
  const [showCreateForm, setShowCreateForm] = useState<string | null>(null);
  const [createType, setCreateType] = useState<'directory' | 'blog' | 'note'>('note');
  const [createName, setCreateName] = useState('');

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const handleCreate = (path: string) => {
    if (!createName.trim()) return;

    if (createType === 'directory') {
      onCreateDirectory(path, createName.trim());
    } else {
      onCreateNote(path, createType as 'blog' | 'note');
    }

    setShowCreateForm(null);
    setCreateName('');
  };

  const renderDirectory = (directory: Directory, level: number = 0) => {
    const isExpanded = expandedPaths.has(directory.path);
    const isSelected = selectedPath === directory.path;

    return (
      <div key={directory.path} className="select-none">
        <div
          className={`flex items-center px-2 py-1 rounded-lg cursor-pointer transition-colors ${
            isSelected ? `${theme.colors.accent} text-white` : `${theme.colors.surfaceHover} ${theme.colors.text}`
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            onPathSelect(directory.path);
            if (directory.children.length > 0) {
              toggleExpanded(directory.path);
            }
          }}
        >
          {directory.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(directory.path);
              }}
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={14} className={theme.colors.textMuted} />
              ) : (
                <ChevronRight size={14} className={theme.colors.textMuted} />
              )}
            </button>
          )}
          {directory.children.length === 0 && <div className="w-5" />}
          
          {isExpanded ? (
            <FolderOpen size={16} className={`mr-2 ${theme.colors.accent.replace('bg-', 'text-')}`} />
          ) : (
            <Folder size={16} className={`mr-2 ${theme.colors.textMuted}`} />
          )}
          
          <span className={`text-sm font-medium truncate ${theme.colors.text}`}>{directory.name}</span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCreateForm(directory.path);
            }}
            className={`ml-auto p-1 opacity-0 group-hover:opacity-100 ${theme.colors.surfaceHover} rounded`}
          >
            <Plus size={12} className={theme.colors.textMuted} />
          </button>
        </div>

        {showCreateForm === directory.path && (
          <div className={`mx-2 my-2 p-3 ${theme.colors.surface} rounded-lg ${theme.colors.border} border`}>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setCreateType('directory')}
                className={`px-2 py-1 text-xs rounded ${
                  createType === 'directory' ? `${theme.colors.accent} text-white` : `${theme.colors.surface} ${theme.colors.textMuted}`
                }`}
              >
                Folder
              </button>
              <button
                onClick={() => setCreateType('blog')}
                className={`px-2 py-1 text-xs rounded ${
                  createType === 'blog' ? `${theme.colors.accent} text-white` : `${theme.colors.surface} ${theme.colors.textMuted}`
                }`}
              >
                Blog
              </button>
              <button
                onClick={() => setCreateType('note')}
                className={`px-2 py-1 text-xs rounded ${
                  createType === 'note' ? `${theme.colors.accent} text-white` : `${theme.colors.surface} ${theme.colors.textMuted}`
                }`}
              >
                Note
              </button>
            </div>
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder={`${createType} name...`}
              className={`w-full px-2 py-1 text-sm ${theme.colors.border} border rounded ${theme.colors.surface} ${theme.colors.text}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate(directory.path);
                if (e.key === 'Escape') setShowCreateForm(null);
              }}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleCreate(directory.path)}
                className={`px-2 py-1 text-xs ${theme.colors.accent} text-white rounded ${theme.colors.accentHover}`}
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(null)}
                className={`px-2 py-1 text-xs ${theme.colors.surface} ${theme.colors.textMuted} rounded ${theme.colors.surfaceHover}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isExpanded && (
          <div>
            {directory.children.map(child => renderDirectory(child, level + 1))}
            {directory.notes.map(note => (
              <div
                key={note.id}
                className={`flex items-center px-2 py-1 rounded-lg cursor-pointer transition-colors ${
                  currentNote?.id === note.id ? `${theme.colors.success} text-white` : `${theme.colors.surfaceHover} ${theme.colors.text}`
                }`}
                style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
                onClick={() => onNoteSelect(note)}
              >
                <FileText size={14} className={`mr-2 ${
                  note.type === 'blog' ? 'text-purple-500' : theme.colors.textMuted
                }`} />
                <span className={`text-sm truncate ${theme.colors.text}`}>{note.title}</span>
                {note.type === 'blog' && (
                  <Edit3 size={10} className="ml-1 text-purple-500" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-80 ${theme.colors.surface} border-r ${theme.colors.border} flex flex-col h-full`}>
      <div className={`p-4 border-b ${theme.colors.border}`}>
        <h2 className={`text-lg font-semibold ${theme.colors.text}`}>Digital Garden</h2>
        <p className={`text-sm ${theme.colors.textMuted}`}>Organize your thoughts</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 group">
        {renderDirectory(directoryTree)}
      </div>
    </div>
  );
};

export default Sidebar;