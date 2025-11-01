import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { useAppData } from './hooks/useAppData';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    folders,
    notes,
    activeFolderId,
    activeNoteId,
    loading,
    setActiveFolderId,
    setActiveNoteId,
    createFolder,
    renameFolder,
    deleteFolder,
    createNote,
    renameNote,
    updateNoteContent,
    deleteNote,
  } = useAppData();
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === '\\') {
      event.preventDefault();
      setIsSidebarOpen(prev => !prev); // ✅ Always latest value
      console.log("Toggled sidebar");
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, []);

  
  const handleSelectFolder = useCallback((folderId: string) => {
    setActiveFolderId(folderId);
    // Select the first note in the new folder, or none if it's empty
    const firstNoteInFolder = notes.find(n => n.folderId === folderId);
    setActiveNoteId(firstNoteInFolder?.id || null);
  }, [notes, setActiveFolderId, setActiveNoteId]);

  const activeNote = useMemo(() => notes.find(note => note.id === activeNoteId), [notes, activeNoteId]);

  if (loading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center text-gray-500">
            Loading your notes...
        </div>
    );
  }
  console.log(isSidebarOpen);
  return (
    <div className="flex h-full  w-full font-sans">
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
         <Sidebar
            isSidebarOpen={isSidebarOpen}
            folders={folders}
            notes={notes}
            activeFolderId={activeFolderId}
            activeNoteId={activeNoteId}
            onSelectFolder={handleSelectFolder}
            onSelectNote={setActiveNoteId}
            onCreateFolder={createFolder}
            onRenameFolder={renameFolder}
            onDeleteFolder={deleteFolder}
            onCreateNote={createNote}
            onRenameNote={renameNote}
            onDeleteNote={deleteNote}
          />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
          <Editor
            key={activeNote?.id || 'empty'}
            note={activeNote}
            onUpdateNote={updateNoteContent}
          />
      </div>
    </div>
  );
};

export default App;