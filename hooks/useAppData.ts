import { useState, useEffect, useCallback } from 'react';
import type { Folder, Note } from '../types';

const API_BASE_URL = 'http://localhost:9000/api'; // Assuming the server is proxied

export const useAppData = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foldersRes, notesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/folders`),
          fetch(`${API_BASE_URL}/notes`),
        ]);

        if (!foldersRes.ok || !notesRes.ok) {
            throw new Error(`HTTP Error: ${foldersRes.status} / ${notesRes.status}`);
        }

        const fetchedFolders = await foldersRes.json();
        const fetchedNotes = await notesRes.json();
        
        setFolders(fetchedFolders);
        setNotes(fetchedNotes);

        if (fetchedFolders.length > 0) {
          const firstFolderId = fetchedFolders[0].id;
          setActiveFolderId(firstFolderId);
          const firstNoteInFolder = fetchedNotes.find((n: Note) => n.folderId === firstFolderId);
          setActiveNoteId(firstNoteInFolder?.id || null);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const createFolder = useCallback(async (): Promise<Folder | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Folder' }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const newFolder = await res.json();
      setFolders(prev => [...prev, newFolder]);
      setActiveFolderId(newFolder.id);
      setActiveNoteId(null);
      return newFolder;
    } catch (error) {
      console.error("Failed to create folder:", error);
      return null;
    }
  }, []);

  const renameFolder = useCallback(async (id: string, newName: string) => {
    if (!newName?.trim()) {
      deleteFolder(id, true);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/folders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const updatedFolder = await res.json();
      setFolders(prev => prev.map(f => (f.id === id ? updatedFolder : f)));
    } catch (error) {
      console.error("Failed to rename folder:", error);
    }
  }, []);

  const deleteFolder = useCallback(async (id: string, skipConfirm = false) => {
    if (skipConfirm || window.confirm('Are you sure you want to delete this folder and all its notes?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/folders/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        
        const remainingFolders = folders.filter(f => f.id !== id);
        setFolders(remainingFolders);
        setNotes(prev => prev.filter(n => n.folderId !== id));

        if (activeFolderId === id) {
          const newActiveFolderId = remainingFolders.length > 0 ? remainingFolders[0].id : null;
          setActiveFolderId(newActiveFolderId);
          setActiveNoteId(null);
        }
      } catch (error) {
        console.error("Failed to delete folder:", error);
      }
    }
  }, [activeFolderId, folders]);

  const createNote = useCallback(async (folderId: string): Promise<Note | null> => {
    const newTitle = 'New Note';
    try {
      const res = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId, title: newTitle, content: `New Note` }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const newNote = await res.json();
      setNotes(prev => [...prev, newNote]);
      setActiveNoteId(newNote.id);
      return newNote;
    } catch (error) {
      console.error("Failed to create note:", error);
      return null;
    }
  }, []);

  const renameNote = useCallback(async (id: string, newTitle: string) => {
     if (!newTitle?.trim()) {
        deleteNote(id, true);
        return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const updatedNote = await res.json();
      setNotes(prev => prev.map(n => (n.id === id ? { ...n, title: updatedNote.title } : n)));
    } catch(e){
        console.error("Failed to rename note:", e);
    }
  }, []);
  
  const updateNoteContent = useCallback(async (id: string, content: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setNotes(prev => prev.map(n => (n.id === id ? { ...n, content } : n)));
    } catch(e) {
        console.error("Failed to update note content:", e);
    }
  }, []);

  const deleteNote = useCallback(async (id: string, skipConfirm = false) => {
    if (skipConfirm || window.confirm('Are you sure you want to delete this note?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/notes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const noteToDelete = notes.find(n => n.id === id);
        setNotes(prev => prev.filter(n => n.id !== id));
        if (activeNoteId === id) {
          const remainingNotes = notes.filter(n => n.folderId === noteToDelete?.folderId && n.id !== id);
          setActiveNoteId(remainingNotes[0]?.id || null);
        }
      } catch(e) {
         console.error("Failed to delete note:", e);
      }
    }
  }, [activeNoteId, notes]);

  return {
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
  };
};