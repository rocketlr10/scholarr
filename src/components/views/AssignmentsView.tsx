import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Trash2,
  Edit3,
  Tag,
  ListTodo,
  Kanban,
  Check
} from 'lucide-react';
import { Assignment, PriorityLevel, AssignmentStatus } from '../../types';

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    courses,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    setIsQuickAddOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredAssignments = assignments.filter(asg => {
    const matchesSearch =
      asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = selectedCourseId === 'all' || asg.courseId === selectedCourseId;
    const matchesPriority = selectedPriority === 'all' || asg.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'overdue'
        ? asg.dueDate < todayStr && asg.status !== 'completed'
        : asg.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">URGENT</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-white/10">LOW</span>;
    }
  };

  const toggleSubtask = (asgId: string, subtaskId: string) => {
    const asg = assignments.find(a => a.id === asgId);
    if (!asg) return;
    const updatedChecklist = asg.checklist.map(c => c.id === subtaskId ? { ...c, completed: !c.completed } : c);
    updateAssignment(asgId, { checklist: updatedChecklist });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header & Controls Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-accent" style={{ color: 'var(--accent-color)' }} />
              Assignment Manager
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Track due dates, subtask checklists, priority levels, and course requirements.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'list' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'kanban' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Kanban className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="px-4 py-2.5 rounded-2xl text-white font-semibold text-xs flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Assignment</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2 border-t border-white/10">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search assignments or tags..."
              className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-xs"
            />
          </div>

          {/* Filter Course */}
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="glass-input px-3 py-2.5 rounded-xl text-xs bg-slate-900 text-white"
          >
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          {/* Filter Priority */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="glass-input px-3 py-2.5 rounded-xl text-xs bg-slate-900 text-white"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Filter Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="glass-input px-3 py-2.5 rounded-xl text-xs bg-slate-900 text-white"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">⚠️ Overdue</option>
          </select>

        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="space-y-3">
          {filteredAssignments.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl text-slate-400">
              <CheckSquare className="w-12 h-12 stroke-1 opacity-40 mx-auto mb-3" />
              <p className="font-semibold text-base text-slate-200">No assignments match filters</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting filters or adding a new assignment.</p>
            </div>
          ) : (
            filteredAssignments.map(asg => {
              const course = courses.find(c => c.id === asg.courseId);
              const isOverdue = asg.dueDate < todayStr && asg.status !== 'completed';
              const isCompleted = asg.status === 'completed';
              const completedSubtasks = asg.checklist.filter(c => c.completed).length;

              return (
                <div
                  key={asg.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all ${
                    isOverdue
                      ? 'border-red-500/40 bg-red-950/20'
                      : isCompleted
                      ? 'border-white/5 opacity-75'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      {/* Status Checkbox */}
                      <button
                        onClick={() =>
                          updateAssignment(asg.id, {
                            status: isCompleted ? 'in_progress' : 'completed',
                          })
                        }
                        className={`mt-1 w-6 h-6 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-white/30 hover:border-emerald-400 hover:bg-emerald-500/20 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div>
                        <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                          <h3 className={`font-bold text-base ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                            {asg.title}
                          </h3>

                          {isOverdue && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> OVERDUE
                            </span>
                          )}

                          {getPriorityBadge(asg.priority)}
                        </div>

                        {/* Metadata row */}
                        <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1.5 flex-wrap gap-y-1">
                          <span
                            className="font-semibold px-2.5 py-0.5 rounded-md text-[10px] border border-white/10"
                            style={{ backgroundColor: `${course?.color || '#3b82f6'}20`, color: course?.color || '#3b82f6' }}
                          >
                            {course?.code || 'General'}
                          </span>

                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Due: {asg.dueDate} {asg.dueTime}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Est: {asg.estimatedMinutes} mins
                          </span>

                          {asg.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[10px] font-mono">
                              #{t}
                            </span>
                          ))}
                        </div>

                        {asg.description && (
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
                            {asg.description}
                          </p>
                        )}

                        {/* Checklist subtasks if present */}
                        {asg.checklist.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                            <p className="text-[11px] font-semibold text-slate-400">
                              Subtasks ({completedSubtasks}/{asg.checklist.length}):
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {asg.checklist.map(sub => (
                                <button
                                  key={sub.id}
                                  onClick={() => toggleSubtask(asg.id, sub.id)}
                                  className={`p-2 rounded-lg border text-xs text-left flex items-center space-x-2 transition-all ${
                                    sub.completed
                                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 line-through'
                                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                                  }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                    sub.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500'
                                  }`}>
                                    {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                  <span className="truncate">{sub.text}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => deleteAssignment(asg.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'in_progress', 'completed'] as AssignmentStatus[]).map(status => {
            const statusAssignments = filteredAssignments.filter(a => a.status === status);
            const statusTitle =
              status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Completed';

            return (
              <div key={status} className="glass-panel p-4 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">{statusTitle}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {statusAssignments.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {statusAssignments.map(asg => {
                    const course = courses.find(c => c.id === asg.courseId);
                    return (
                      <div
                        key={asg.id}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="font-medium px-2 py-0.5 rounded text-[10px] border border-white/10"
                            style={{ backgroundColor: `${course?.color || '#3b82f6'}20`, color: course?.color || '#3b82f6' }}
                          >
                            {course?.code || 'Course'}
                          </span>
                          {getPriorityBadge(asg.priority)}
                        </div>

                        <h4 className="font-bold text-sm text-white">{asg.title}</h4>
                        <p className="text-xs text-slate-400">Due: {asg.dueDate}</p>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <select
                            value={asg.status}
                            onChange={e => updateAssignment(asg.id, { status: e.target.value as AssignmentStatus })}
                            className="bg-slate-900 text-slate-300 text-[10px] px-2 py-1 rounded border border-white/10"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>

                          <button
                            onClick={() => deleteAssignment(asg.id)}
                            className="p-1 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
