export type AccentTheme = 'indigo' | 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'teal';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type AssignmentStatus = 'todo' | 'in_progress' | 'submitted' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  school?: string;
  majorOrGrade?: string;
  createdAt: string;
  accentColor: AccentTheme;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  courseId: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: PriorityLevel;
  estimatedMinutes: number;
  status: AssignmentStatus;
  tags: string[];
  checklist: ChecklistItem[];
  notes?: string;
  schoologyId?: string;
  googleCalEventId?: string;
  reminderTime?: '1h' | '3h' | '1d' | '3d' | '1w' | 'custom';
}

export interface Course {
  id: string;
  userId: string;
  name: string;
  code: string;
  color: string;
  icon: string;
  teacher: string;
  room?: string;
  scheduleDays?: string[]; // e.g. ['Mon', 'Wed', 'Fri']
  startTime?: string; // e.g. '09:30' (HH:mm)
  endTime?: string; // e.g. '10:45' (HH:mm)
  schedule?: string;
  syllabus?: string;
  gradeAverage?: number; // e.g. 94.5
  schoologyCourseId?: string;
}

export type EventType = 'assignment' | 'exam' | 'lecture' | 'study' | 'personal';

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  type: EventType;
  courseId?: string;
  startDate: string; // ISO String or YYYY-MM-DD
  endDate?: string;
  allDay?: boolean;
  description?: string;
  location?: string;
  googleCalSynced?: boolean;
}

export interface PomodoroSession {
  id: string;
  userId: string;
  courseId?: string;
  durationMinutes: number;
  sessionType: 'pomodoro' | 'short_break' | 'long_break' | 'custom' | 'stopwatch';
  completedAt: string; // ISO date string
  notes?: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  courseId?: string;
  content: string;
  tags: string[];
  pinned?: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'overdue' | 'timer' | 'reminder' | 'schoology' | 'google_cal';
  read: boolean;
  timestamp: string;
  linkView?: string;
}

export interface SchoologyConfig {
  connected: boolean;
  domain?: string;
  apiKey?: string;
  lastSynced?: string;
  autoSync: boolean;
  syncIntervalMinutes: number;
}

export interface GoogleCalConfig {
  connected: boolean;
  email?: string;
  autoExportAssignments: boolean;
  lastSynced?: string;
}

export interface UserPreferences {
  accentColor: AccentTheme;
  glassOpacity: number;
  soundEnabled: boolean;
  ambientSound: 'none' | 'chime' | 'rain' | 'white_noise';
  schoology: SchoologyConfig;
  googleCal: GoogleCalConfig;
  pomodoroWorkMinutes: number;
  pomodoroShortBreakMinutes: number;
  pomodoroLongBreakMinutes: number;
}
