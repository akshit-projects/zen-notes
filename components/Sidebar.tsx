import React, { useState, useEffect } from 'react';
import type { Folder, Note } from '../types';
import { FolderIcon, FileIcon, PlusIcon, EditIcon, TrashIcon } from './icons';

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  activeFolderId: string | null;
  activeNoteId: string | null;
  isSidebarOpen: boolean;
  onSelectFolder: (folderId: string) => void;
  onSelectNote: (noteId: string) => void;
  onCreateFolder: () => Promise<Folder | null>;
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onCreateNote: (folderId: string) => Promise<Note | null>;
  onRenameNote: (noteId: string, newTitle: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const SidebarItemInput: React.FC<{
    initialValue: string;
    
    onRename: (newValue: string) => void;
    onCancel: () => void;
}> = ({ initialValue, onRename, onCancel }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onRename(e.currentTarget.value);
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };
    return (
        <input
            type="text"
            defaultValue={initialValue}
            onBlur={(e) => onRename(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border border-blue-400 rounded-md px-2 py-1 text-sm focus:outline-none"
            autoFocus
            onFocus={(e) => e.target.select()}
        />
    )
};


const Sidebar: React.FC<SidebarProps> = ({
  folders,
  notes,
  activeFolderId,
  activeNoteId,
  isSidebarOpen,
  onSelectFolder,
  onSelectNote,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onCreateNote,
  onRenameNote,
  onDeleteNote,
}) => {
  const [editingItem, setEditingItem] = useState<{ id: string, type: 'folder' | 'note'} | null>(null);

  useEffect(() => {
    // If active note changes, cancel editing
    setEditingItem(null);
  }, [activeNoteId]);
  
  const handleCreateFolder = async () => {
    const newFolder = await onCreateFolder();
    if (newFolder) {
      setEditingItem({ id: newFolder.id, type: 'folder' });
    }
  };
  
  const handleCreateNote = async (folderId: string) => {
    const newNote = await onCreateNote(folderId);
    if (newNote) {
      setEditingItem({ id: newNote.id, type: 'note' });
    }
  };

  return (
    <aside className={`h-full ${isSidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 bg-gray-100 p-4 border-r border-gray-200 overflow-y-auto`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Folders</h2>
        <button
          onClick={handleCreateFolder}
          className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-md"
          title="New Folder"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <nav>
        <ul>
          {folders.map(folder => (
            <li key={folder.id} className="mb-2">
              <div
                onClick={() => onSelectFolder(folder.id)}
                className={`group flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  activeFolderId === folder.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center truncate w-full">
                  <FolderIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  {editingItem?.id === folder.id && editingItem.type === 'folder' ? (
                      <SidebarItemInput
                        initialValue={folder.name}
                        onRename={(newName) => { onRenameFolder(folder.id, newName); setEditingItem(null); }}
                        onCancel={() => setEditingItem(null)}
                      />
                  ) : (
                    <span className="font-medium truncate">{folder.name}</span>
                  )}
                </div>
                {!(editingItem?.id === folder.id) && (
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setEditingItem({id: folder.id, type: 'folder'}) }} className="p-1 hover:text-blue-600 rounded-md"><EditIcon className="w-4 h-4"/></button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }} className="p-1 hover:text-red-600 rounded-md"><TrashIcon className="w-4 h-4"/></button>
                  </div>
                )}
              </div>
              
              {activeFolderId === folder.id && (
                <ul className="pl-4 mt-1 border-l-2 border-gray-200">
                  {notes.filter(n => n.folderId === folder.id).map(note => (
                    <li key={note.id} className="mt-1">
                      <div
                        onClick={() => onSelectNote(note.id)}
                        className={`group flex items-center justify-between p-2 rounded-md cursor-pointer text-sm ${
                          activeNoteId === note.id ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-200'
                        }`}
                      >
                         <div className="flex items-center truncate w-full">
                          <FileIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          {editingItem?.id === note.id && editingItem.type === 'note' ? (
                            <SidebarItemInput
                                initialValue={note.title}
                                onRename={(newTitle) => { onRenameNote(note.id, newTitle); setEditingItem(null); }}
                                onCancel={() => setEditingItem(null)}
                            />
                          ) : (
                            <span className="truncate">{note.title}</span>
                          )}
                         </div>
                         {!(editingItem?.id === note.id) && (
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); setEditingItem({ id: note.id, type: 'note' }); }} className="p-1 hover:text-blue-600 rounded-md"><EditIcon className="w-4 h-4"/></button>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }} className="p-1 hover:text-red-600 rounded-md"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                         )}
                      </div>
                    </li>
                  ))}
                   <button 
                    onClick={() => handleCreateNote(folder.id)}
                    className="flex items-center text-sm p-2 text-gray-500 hover:text-gray-800 w-full mt-1">
                    <PlusIcon className="w-4 h-4 mr-2"/> Add Note
                  </button>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;