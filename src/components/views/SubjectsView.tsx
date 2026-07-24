import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Plus,
  BookOpen,
  User,
  MapPin,
  Clock,
  Trash2,
  FileText,
  CheckSquare,
  Award
} from 'lucide-react';
import { Course } from '../../types';

export const SubjectsView: React.FC = () => {
  const { courses, assignments, notes, addCourse, deleteCourse, setIsQuickAddOpen } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0] || null);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-400" />
            <span>Subjects & Enrolled Courses</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Course syllabi, grade performance, instructors, room schedules, and notes.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl text-white font-semibold text-xs flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Grid of Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map(course => {
          const courseAssignments = assignments.filter(a => a.courseId === course.id);
          const courseNotes = notes.filter(n => n.courseId === course.id);

          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`p-5 rounded-3xl glass-panel border transition-all cursor-pointer relative overflow-hidden group ${
                selectedCourse?.id === course.id
                  ? 'border-white/30 shadow-xl bg-white/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Color Bar Accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: course.color }}
              />

              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                  {course.code}
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {course.gradeAverage ? `${course.gradeAverage}%` : 'N/A'}
                </span>
              </div>

              <h3 className="font-bold text-base text-white mt-2 group-hover:text-accent transition-colors">
                {course.name}
              </h3>

              <div className="space-y-1 mt-3 text-xs text-slate-300">
                <p className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{course.teacher}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{course.room || 'TBD Room'}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{course.schedule || 'Schedule Set'}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>{courseAssignments.length} Assignments</span>
                <span>{courseNotes.length} Notes</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Course Detail Modal / Panel */}
      {selectedCourse && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-10 rounded-full"
                style={{ backgroundColor: selectedCourse.color }}
              />
              <div>
                <h2 className="text-xl font-bold text-white">{selectedCourse.name} ({selectedCourse.code})</h2>
                <p className="text-xs text-slate-400">{selectedCourse.teacher} • {selectedCourse.room}</p>
              </div>
            </div>

            <button
              onClick={() => deleteCourse(selectedCourse.id)}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Course</span>
            </button>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Course Syllabus Overview</h4>
            <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
              {selectedCourse.syllabus || 'No syllabus uploaded.'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
