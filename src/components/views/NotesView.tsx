import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Save,
  Tag,
  Check,
  BookOpen
} from 'lucide-react';
import { Note } from '../../types';

export const NotesView: React.FC = () => {
  const { notes, courses, addNote, updateNote, deleteNote } = useApp();

  const [activeNote, setActiveNote] = useState<Note | null>(notes[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  const filteredNotes = notes.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourseFilter === 'all' || n.courseId === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  const handleCreateNewNote = () => {
    const newNote = addNote({
      title: 'Untitled Note',
      content: '# New Study Document\n\nStart typing notes, formula definitions, or lecture summaries here...',
      tags: ['General'],
      courseId: courses[0]?.id,
    });
    setActiveNote(newNote);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-pink-400" />
            <span>Rich Study Notes & Documents</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Notion-style note taking with code snippets, course tags, search, and Markdown support.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="px-4 py-2.5 rounded-2xl text-white font-semibold text-xs flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Split View: Sidebar list (1 col) + Editor (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Notes Navigation Sidebar */}
        <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-3">
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No notes found.</p>
            ) : (
              filteredNotes.map(n => {
                const isSelected = activeNote?.id === n.id;
                const course = courses.find(c => c.id === n.courseId);

                return (
                  <button
                    key={n.id}
                    onClick={() => setActiveNote(n)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-white/15 border-white/25 text-white shadow-md'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {n.pinned && (
                      <Pin className="w-3 h-3 text-amber-400 absolute top-3 right-3" />
                    )}

                    <h4 className="font-bold text-xs text-white truncate pr-4">{n.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-sans">
                      {n.content.replace(/[#*`]/g, '')}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span
                        className="px-2 py-0.5 rounded font-mono"
                        style={{ backgroundColor: `${course?.color || '#3b82f6'}20`, color: course?.color || '#3b82f6' }}
                      >
                        {course?.code || 'General'}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {new Date(n.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Note Editor Area */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          {activeNote ? (
            <div className="space-y-4">
              
              {/* Note Header Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={e => {
                    const val = e.target.value;
                    setActiveNote({ ...activeNote, title: val });
                    updateNote(activeNote.id, { title: val });
                  }}
                  className="bg-transparent text-xl font-bold text-white focus:outline-none w-full mr-4"
                  placeholder="Note Title..."
                />

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      const updatedPin = !activeNote.pinned;
                      setActiveNote({ ...activeNote, pinned: updatedPin });
                      updateNote(activeNote.id, { pinned: updatedPin });
                    }}
                    className={`p-2 rounded-xl border transition-colors ${
                      activeNote.pinned ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                    title="Pin Note"
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      deleteNote(activeNote.id);
                      setActiveNote(notes.find(n => n.id !== activeNote.id) || null);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text Area Body */}
              <textarea
                value={activeNote.content}
                onChange={e => {
                  const val = e.target.value;
                  setActiveNote({ ...activeNote, content: val });
                  updateNote(activeNote.id, { content: val });
                }}
                rows={16}
                className="w-full bg-transparent text-slate-200 text-sm font-mono focus:outline-none resize-none leading-relaxed p-2"
                placeholder="Start typing markdown content..."
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Select or create a note to start editing.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
