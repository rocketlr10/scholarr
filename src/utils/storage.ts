import {
  User,
  Assignment,
  Course,
  CalendarEvent,
  PomodoroSession,
  Note,
  NotificationItem,
  UserPreferences,
  AccentTheme
} from '../types';

const STORAGE_KEYS = {
  USERS: 'scholar_users',
  CURRENT_USER: 'scholar_current_user_id',
  ASSIGNMENTS: 'scholar_assignments',
  COURSES: 'scholar_courses',
  EVENTS: 'scholar_events',
  POMODORO: 'scholar_pomodoro_sessions',
  NOTES: 'scholar_notes',
  NOTIFICATIONS: 'scholar_notifications',
  PREFERENCES: 'scholar_preferences',
};

// Data Purge Version Migration to ensure 100% clean slate
const DATA_VERSION = 'v4_total_reset_blank';
if (typeof window !== 'undefined') {
  try {
    const currentVer = localStorage.getItem('scholar_data_version');
    if (currentVer !== DATA_VERSION) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('scholar_')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('scholar_data_version', DATA_VERSION);
    }
  } catch (e) {
    console.warn('Storage purge error:', e);
  }
}

// Function to manually wipe all local scholar data
export function wipeAllScholarData() {
  if (typeof window !== 'undefined') {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('scholar_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.setItem('scholar_data_version', DATA_VERSION);
    window.location.reload();
  }
}

// Default User (Blank Slate)
export const DEFAULT_USER: User = {
  id: 'guest_student',
  name: 'Student',
  email: 'student@scholar.app',
  school: 'My School',
  majorOrGrade: '',
  createdAt: new Date().toISOString(),
  accentColor: 'indigo',
};

// Default Preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  accentColor: 'indigo',
  glassOpacity: 0.75,
  soundEnabled: true,
  ambientSound: 'none',
  schoology: {
    connected: false,
    domain: '',
    apiKey: '',
    lastSynced: '',
    autoSync: false,
    syncIntervalMinutes: 30,
  },
  googleCal: {
    connected: false,
    email: '',
    autoExportAssignments: false,
    lastSynced: '',
  },
  pomodoroWorkMinutes: 25,
  pomodoroShortBreakMinutes: 5,
  pomodoroLongBreakMinutes: 15,
};

// Format Date YYYY-MM-DD helper
export function formatDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

// Initial Empty Data Collections for New Users
const INITIAL_COURSES: Course[] = [];
const INITIAL_ASSIGNMENTS: Assignment[] = [];
const INITIAL_EVENTS: CalendarEvent[] = [];
const INITIAL_POMODOROS: PomodoroSession[] = [];
const INITIAL_NOTES: Note[] = [];
const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

// Helper Storage Getters / Setters
export function getStoredUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || null;
}

export function setCurrentUserId(userId: string) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
}

export function saveUser(user: User) {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getStoredAssignments(userId: string): Assignment[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.ASSIGNMENTS}_${userId}`);
  if (!data) {
    localStorage.setItem(`${STORAGE_KEYS.ASSIGNMENTS}_${userId}`, JSON.stringify(INITIAL_ASSIGNMENTS));
    return INITIAL_ASSIGNMENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ASSIGNMENTS;
  }
}

export function saveStoredAssignments(userId: string, items: Assignment[]) {
  localStorage.setItem(`${STORAGE_KEYS.ASSIGNMENTS}_${userId}`, JSON.stringify(items));
}

export function getStoredCourses(userId: string): Course[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.COURSES}_${userId}`);
  if (!data) {
    localStorage.setItem(`${STORAGE_KEYS.COURSES}_${userId}`, JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_COURSES;
  }
}

export function saveStoredCourses(userId: string, items: Course[]) {
  localStorage.setItem(`${STORAGE_KEYS.COURSES}_${userId}`, JSON.stringify(items));
}

export function getStoredEvents(userId: string): CalendarEvent[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.EVENTS}_${userId}`);
  if (!data) {
    localStorage.setItem(`${STORAGE_KEYS.EVENTS}_${userId}`, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_EVENTS;
  }
}

export function saveStoredEvents(userId: string, items: CalendarEvent[]) {
  localStorage.setItem(`${STORAGE_KEYS.EVENTS}_${userId}`, JSON.stringify(items));
}

export function getStoredPomodoros(userId: string): PomodoroSession[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.POMODORO}_${userId}`);
  if (!data) {
    localStorage.setItem(`${STORAGE_KEYS.POMODORO}_${userId}`, JSON.stringify(INITIAL_POMODOROS));
    return INITIAL_POMODOROS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_POMODOROS;
  }
}

export function saveStoredPomodoros(userId: string, items: PomodoroSession[]) {
  localStorage.setItem(`${STORAGE_KEYS.POMODORO}_${userId}`, JSON.stringify(items));
}

export function getStoredNotes(userId: string): Note[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.NOTES}_${userId}`);
  if (!data) {
    localStorage.setItem(`${STORAGE_KEYS.NOTES}_${userId}`, JSON.stringify(INITIAL_NOTES));
    return INITIAL_NOTES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveStoredNotes(userId: string, items: Note[]) {
  localStorage.setItem(`${STORAGE_KEYS.NOTES}_${userId}`, JSON.stringify(items));
}

export function getStoredNotifications(userId: string): NotificationItem[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`);
  if (!data) {
    localStorage.setItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(userId: string, items: NotificationItem[]) {
  localStorage.setItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`, JSON.stringify(items));
}

export function getStoredPreferences(userId: string): UserPreferences {
  const data = localStorage.getItem(`${STORAGE_KEYS.PREFERENCES}_${userId}`);
  if (!data) {
    localStorage.setItem(`${STORAGE_KEYS.PREFERENCES}_${userId}`, JSON.stringify(DEFAULT_PREFERENCES));
    return DEFAULT_PREFERENCES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveStoredPreferences(userId: string, prefs: UserPreferences) {
  localStorage.setItem(`${STORAGE_KEYS.PREFERENCES}_${userId}`, JSON.stringify(prefs));
}

// Accent Color Mapping CSS Values
export const ACCENT_COLORS: Record<AccentTheme, { name: string; hex: string; rgb: string; tailwind: string }> = {
  indigo: { name: 'Royal Indigo', hex: '#6366F1', rgb: '99, 102, 241', tailwind: 'indigo-500' },
  blue: { name: 'Ocean Blue', hex: '#3B82F6', rgb: '59, 130, 246', tailwind: 'blue-500' },
  purple: { name: 'Electric Purple', hex: '#A855F7', rgb: '168, 85, 247', tailwind: 'purple-500' },
  pink: { name: 'Sakura Pink', hex: '#EC4899', rgb: '236, 72, 153', tailwind: 'pink-500' },
  green: { name: 'Emerald Green', hex: '#10B981', rgb: '16, 185, 129', tailwind: 'emerald-500' },
  orange: { name: 'Sunset Orange', hex: '#F97316', rgb: '249, 115, 22', tailwind: 'orange-500' },
  teal: { name: 'Cyber Teal', hex: '#14B8A6', rgb: '20, 184, 166', tailwind: 'teal-500' },
};

export function applyAccentToRoot(accent: AccentTheme) {
  const info = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;
  document.documentElement.style.setProperty('--accent-color', info.hex);
  document.documentElement.style.setProperty('--accent-rgb', info.rgb);
  document.documentElement.style.setProperty('--accent-light', `rgba(${info.rgb}, 0.15)`);
}
