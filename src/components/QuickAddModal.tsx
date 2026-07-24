import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckSquare,
  Calendar as CalendarIcon,
  Timer,
  FileText,
  GraduationCap,
  Plus,
  Clock
} from 'lucide-react';
import { PriorityLevel } from '../types';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    courses,
    addAssignment,
    addEvent,
    addNote,
    addCourse,
    addPomodoroSession
  } = useApp();

  const [activeTab, setActiveTab] = useState<'assignment' | 'event' | 'note' | 'course'>('assignment');

  // Assignment Form state
  const [asgTitle, setAsgTitle] = useState('');
  const [asgCourseId, setAsgCourseId] = useState(courses[0]?.id || '');
  const [asgDueDate, setAsgDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [asgDueTime, setAsgDueTime] = useState('23:59');
  const [asgPriority, setAsgPriority] = useState<PriorityLevel>('medium');
  const [asgMinutes, setAsgMinutes] = useState(60);
  const [asgDesc, setAsgDesc] = useState('');

  // Event Form state
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState(new Date().toISOString().split('T')[0]);
  const [evtTime, setEvtTime] = useState('14:00');
  const [evtType, setEvtType] = useState<'assignment' | 'exam' | 'lecture' | 'study' | 'personal'>('study');

  // Note Form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Course Form state
  const [crsName, setCrsName] = useState('');
  const [crsCode, setCrsCode] = useState('');
  const [crsTeacher, setCrsTeacher] = useState('');
  const [crsRoom, setCrsRoom] = useState('');
  const [crsStartTime, setCrsStartTime] = useState('09:00');
  const [crsEndTime, setCrsEndTime] = useState('10:15');
  const [crsDays, setCrsDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [crsColor, setCrsColor] = useState('#3B82F6');

  const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (crsDays.includes(day)) {
      setCrsDays(crsDays.filter(d => d !== day));
    } else {
      setCrsDays([...crsDays, day]);
    }
  };

  if (!isQuickAddOpen) return null;

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;
    addAssignment({
      title: asgTitle,
      courseId: asgCourseId || courses[0]?.id || 'course_default',
      dueDate: asgDueDate,
      dueTime: asgDueTime,
      priority: asgPriority,
      estimatedMinutes: Number(asgMinutes),
      status: 'todo',
      description: asgDesc,
      tags: ['Homework'],
      checklist: [],
    });
    setIsQuickAddOpen(false);
    resetForms();
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim()) return;
    addEvent({
      title: evtTitle,
      type: evtType,
      startDate: `${evtDate}T${evtTime}:00`,
      courseId: asgCourseId,
    });
    setIsQuickAddOpen(false);
    resetForms();
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addNote({
      title: noteTitle,
      content: noteContent || '# ' + noteTitle + '\n\nWrite study notes here...',
      tags: ['Quick Note'],
      courseId: asgCourseId,
    });
    setIsQuickAddOpen(false);
    resetForms();
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crsName.trim()) return;
    addCourse({
      name: crsName,
      code: crsCode || 'COURSE 101',
      color: crsColor || '#3B82F6',
      icon: 'BookOpen',
      teacher: crsTeacher || 'Instructor',
      room: crsRoom || 'Room TBD',
      scheduleDays: crsDays.length > 0 ? crsDays : ['Mon', 'Wed', 'Fri'],
      startTime: crsStartTime || '09:00',
      endTime: crsEndTime || '10:15',
      schedule: `${crsDays.join(', ')} • ${crsStartTime}`,
      gradeAverage: 100,
    });
    setIsQuickAddOpen(false);
    resetForms();
  };

  const resetForms = () => {
    setAsgTitle('');
    setEvtTitle('');
    setNoteTitle('');
    setCrsName('');
    setAsgDesc('');
    setNoteContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-white/15 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header Tabs */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-medium">
            <button
              onClick={() => setActiveTab('assignment')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'assignment' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Assignment</span>
            </button>
            <button
              onClick={() => setActiveTab('event')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'event' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Event</span>
            </button>
            <button
              onClick={() => setActiveTab('note')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'note' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Note</span>
            </button>
            <button
              onClick={() => setActiveTab('course')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'course' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Course</span>
            </button>
          </div>

          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Forms */}
        <div className="p-5 text-xs">
          {activeTab === 'assignment' && (
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={asgTitle}
                  onChange={e => setAsgTitle(e.target.value)}
                  placeholder="e.g. Dynamic Programming Problem Set"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Course</label>
                  <select
                    value={asgCourseId}
                    onChange={e => setAsgCourseId(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900 text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={asgPriority}
                    onChange={e => setAsgPriority(e.target.value as PriorityLevel)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900 text-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Deadline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={asgDueDate}
                    onChange={e => setAsgDueDate(e.target.value)}
                    className="w-full glass-input px-2.5 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Due Time</label>
                  <input
                    type="time"
                    value={asgDueTime}
                    onChange={e => setAsgDueTime(e.target.value)}
                    className="w-full glass-input px-2.5 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Est. Mins</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={asgMinutes}
                    onChange={e => setAsgMinutes(Number(e.target.value))}
                    className="w-full glass-input px-2.5 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={asgDesc}
                  onChange={e => setAsgDesc(e.target.value)}
                  placeholder="Additional context or submission details..."
                  className="w-full glass-input p-3 rounded-xl text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg active:scale-98 transition-all"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Create Assignment
              </button>
            </form>
          )}

          {activeTab === 'event' && (
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={evtTitle}
                  onChange={e => setEvtTitle(e.target.value)}
                  placeholder="e.g. Physics Midterm Exam or Study Session"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Type</label>
                  <select
                    value={evtType}
                    onChange={e => setEvtType(e.target.value as any)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900 text-white"
                  >
                    <option value="study">Study Block</option>
                    <option value="exam">Exam / Test</option>
                    <option value="lecture">Class Lecture</option>
                    <option value="assignment">Assignment Due</option>
                    <option value="personal">Personal Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Course (Optional)</label>
                  <select
                    value={asgCourseId}
                    onChange={e => setAsgCourseId(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900 text-white"
                  >
                    <option value="">None / General</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={evtDate}
                    onChange={e => setEvtDate(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={evtTime}
                    onChange={e => setEvtTime(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg transition-all"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Schedule Event
              </button>
            </form>
          )}

          {activeTab === 'note' && (
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="e.g. Lecture 12: Graph Theory Notes"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Content (Markdown supported)</label>
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Start writing notes or key formula definitions..."
                  className="w-full glass-input p-3 rounded-xl text-xs font-mono resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg transition-all"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Save Document
              </button>
            </form>
          )}

          {activeTab === 'course' && (
            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={crsName}
                  onChange={e => setCrsName(e.target.value)}
                  placeholder="e.g. Organic Chemistry I"
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Course Code</label>
                  <input
                    type="text"
                    value={crsCode}
                    onChange={e => setCrsCode(e.target.value)}
                    placeholder="e.g. CHEM 31A"
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Teacher / Instructor</label>
                  <input
                    type="text"
                    value={crsTeacher}
                    onChange={e => setCrsTeacher(e.target.value)}
                    placeholder="e.g. Prof. Davis"
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={crsRoom}
                    onChange={e => setCrsRoom(e.target.value)}
                    placeholder="e.g. Room 204"
                    className="w-full glass-input px-2.5 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={crsStartTime}
                    onChange={e => setCrsStartTime(e.target.value)}
                    className="w-full glass-input px-2 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={crsEndTime}
                    onChange={e => setCrsEndTime(e.target.value)}
                    className="w-full glass-input px-2 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Class Schedule Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_DAYS.map(day => {
                    const isSelected = crsDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl text-white font-semibold text-sm shadow-lg transition-all"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Add Class
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
