import { Directory, Note } from '../types';

export function createPath(parentPath: string, name: string): string {
  return parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
}

export function getParentPath(path: string): string {
  if (path === '/') return '/';
  const parts = path.split('/').filter(Boolean);
  return parts.length <= 1 ? '/' : '/' + parts.slice(0, -1).join('/');
}

export function getPathName(path: string): string {
  if (path === '/') return 'Root';
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1] || 'Root';
}

export function buildDirectoryTree(notes: Note[]): Directory {
  const root: Directory = {
    name: 'Root',
    path: '/',
    children: [],
    notes: []
  };

  const directoryMap = new Map<string, Directory>();
  directoryMap.set('/', root);

  // First, create all directories
  notes.forEach(note => {
    const pathParts = note.path.split('/').filter(Boolean);
    let currentPath = '/';
    
    pathParts.forEach((part, index) => {
      const newPath = currentPath === '/' ? `/${part}` : `${currentPath}/${part}`;
      
      if (!directoryMap.has(newPath)) {
        const newDir: Directory = {
          name: part,
          path: newPath,
          children: [],
          notes: []
        };
        
        directoryMap.set(newPath, newDir);
        
        const parentDir = directoryMap.get(currentPath);
        if (parentDir && !parentDir.children.find(child => child.path === newPath)) {
          parentDir.children.push(newDir);
        }
      }
      
      currentPath = newPath;
    });
  });

  // Then, assign notes to their directories
  notes.forEach(note => {
    const dir = directoryMap.get(note.path);
    if (dir) {
      dir.notes.push(note);
    }
  });

  // Sort directories and notes
  const sortDirectory = (dir: Directory) => {
    dir.children.sort((a, b) => a.name.localeCompare(b.name));
    dir.notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    dir.children.forEach(sortDirectory);
  };

  sortDirectory(root);
  return root;
}