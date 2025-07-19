import React, { useState, useEffect } from 'react';
import { Save, Edit3, Eye, Calendar, MapPin, Code, Calculator, Type } from 'lucide-react';
import { Note } from '../types';
import { useTheme } from '../hooks/useTheme';
import MarkdownRenderer from './MarkdownRenderer';

interface EditorProps {
  note: Note | null;
  isEditing: boolean;
  onSave: (note: Note) => void;
  onToggleEdit: () => void;
}

const Editor: React.FC<EditorProps> = ({ note, isEditing, onSave, onToggleEdit }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = () => {
    if (!note) return;
    
    const updatedNote: Note = {
      ...note,
      title: title.trim() || 'Untitled',
      content,
      updatedAt: new Date()
    };
    
    onSave(updatedNote);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const insertTemplate = (template: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + template + content.substring(end);
    setContent(newContent);
    
    // Set cursor position after template
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length, start + template.length);
    }, 0);
  };

  if (!note) {
    return (
      <div className={`flex-1 flex items-center justify-center ${theme.colors.bg}`}>
        <div className="text-center">
          <Edit3 size={48} className={`mx-auto ${theme.colors.textMuted} mb-4`} />
          <h3 className={`text-xl font-medium ${theme.colors.textSecondary} mb-2`}>No note selected</h3>
          <p className={theme.colors.textMuted}>Choose a note from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${theme.colors.surface}`}>
      {/* Header */}
      <div className={`border-b ${theme.colors.border} p-4`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              note.type === 'blog' 
                ? 'bg-purple-100 text-purple-800' 
                : `${theme.colors.surface} ${theme.colors.textSecondary}`
            }`}>
              {note.type}
            </span>
            <div className={`flex items-center text-sm ${theme.colors.textMuted}`}>
              <MapPin size={14} className={`mr-1 ${theme.colors.textMuted}`} />
              {note.path}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleEdit}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
                isEditing 
                  ? `${theme.colors.surface} ${theme.colors.textSecondary}` 
                  : `${theme.colors.accent} text-white ${theme.colors.accentHover}`
              }`}
            >
              {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
              <span>{isEditing ? 'Preview' : 'Edit'}</span>
            </button>
            
            {isEditing && (
              <button
                onClick={handleSave}
                className={`flex items-center space-x-1 px-3 py-1.5 ${theme.colors.success} text-white rounded-lg hover:bg-green-600 transition-colors`}
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            )}
          </div>
        </div>
        
        <div className={`flex items-center text-sm ${theme.colors.textMuted} space-x-4`}>
          <div className="flex items-center">
            <Calendar size={14} className={`mr-1 ${theme.colors.textMuted}`} />
            Created: {formatDate(note.createdAt)}
          </div>
          <div className="flex items-center">
            <Calendar size={14} className={`mr-1 ${theme.colors.textMuted}`} />
            Updated: {formatDate(note.updatedAt)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <div className="h-full flex flex-col p-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className={`text-2xl font-bold border-none outline-none mb-4 ${theme.colors.text} ${theme.colors.surface} placeholder-gray-400`}
            />
            
            {/* Formatting Toolbar */}
            <div className={`flex items-center space-x-2 mb-4 p-2 ${theme.colors.surface} rounded-lg border ${theme.colors.border}`}>
              <button
                onClick={() => insertTemplate('```javascript\n// Your code here\n```')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs rounded ${theme.colors.surfaceHover} ${theme.colors.textSecondary}`}
                title="Insert code block"
              >
                <Code size={14} />
                <span>Code</span>
              </button>
              
              <button
                onClick={() => insertTemplate('$$\n\\frac{a}{b} = c\n$$')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs rounded ${theme.colors.surfaceHover} ${theme.colors.textSecondary}`}
                title="Insert math equation"
              >
                <Calculator size={14} />
                <span>Math</span>
              </button>
              
              <button
                onClick={() => insertTemplate('**bold text**')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs rounded ${theme.colors.surfaceHover} ${theme.colors.textSecondary}`}
                title="Bold text"
              >
                <Type size={14} />
                <span>Bold</span>
              </button>
              
              <button
                onClick={() => insertTemplate('*italic text*')}
                className={`px-2 py-1 text-xs rounded ${theme.colors.surfaceHover} ${theme.colors.textSecondary} italic`}
                title="Italic text"
              >
                Italic
              </button>
              
              <button
                onClick={() => insertTemplate('`inline code`')}
                className={`px-2 py-1 text-xs rounded ${theme.colors.surfaceHover} ${theme.colors.textSecondary} font-mono`}
                title="Inline code"
              >
                `code`
              </button>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts...

Formatting tips:
# Heading 1
## Heading 2
**bold** *italic* `code`

Code blocks:
```javascript
console.log('Hello World');
```

Math equations:
Inline: $E = mc^2$
Block: $$\\frac{a}{b} = c$$"
              className={`flex-1 resize-none border-none outline-none ${theme.colors.textSecondary} ${theme.colors.surface} leading-relaxed placeholder-gray-400`}
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <MarkdownRenderer 
              content={`# ${note.title}\n\n${note.content}`}
              className={theme.colors.textSecondary}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;