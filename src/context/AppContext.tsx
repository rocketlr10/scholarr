import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import {
  getStoredUsers,
  getCurrentUserId,
  setCurrentUserId as saveCurrentUserId,
  saveUser,
  getStoredAssignments,
  saveStoredAssignments,
  getStoredCourses,
  saveStoredCourses,
  getStoredEvents,
  saveStoredEvents,
  getStoredPomodoros,
  saveStoredPomodoros,
  getStoredNotes,
  saveStoredNotes,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredPreferences,
  saveStoredPreferences,
  applyAccentToRoot,
  formatDateOffset
} from '../utils/storage';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
  loginUser: (email: string, name?: string) => void;
  registerUser: (email: string, name: string, school?: string) => void;
  logoutUser: () => void;
  
  currentView: string;
  setCurrentView: (view: string) => void;
  
  accentColor: AccentTheme;
  setAccentColor: (accent: AccentTheme) => void;
  
  preferences: UserPreferences;
  updatePreferences: (updated: Partial<UserPreferences>) => void;
  
  assignments: Assignment[];
  addAssignment: (asg: Omit<Assignment, 'id' | 'userId'>) => Assignment;
  updateAssignment: (id: string, updated: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'userId'>) => Course;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  events: CalendarEvent[];
  addEvent: (evt: Omit<CalendarEvent, 'id' | 'userId'>) => CalendarEvent;
  updateEvent: (id: string, updated: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
  pomodoros: PomodoroSession[];
  addPomodoroSession: (session: Omit<PomodoroSession, 'id' | 'userId' | 'completedAt'>) => void;
  
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updated: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type'], linkView?: string) => void;
  
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  
  isSyncingSchoology: boolean;
  syncSchoologyNow: () => Promise<void>;
  syncGoogleCalendarNow: () => Promise<void>;
  
  exportUserDataJSON: () => string;
  importUserDataJSON: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(getStoredUsers);
  const [currentUserId, setCurrentUserIdState] = useState<string>(getCurrentUserId);
  
  // Active User object
  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0];
  
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [preferences, setPreferences] = useState<UserPreferences>(() => getStoredPreferences(currentUser.id));
  const [accentColor, setAccentColorState] = useState<AccentTheme>(currentUser.accentColor || preferences.accentColor || 'blue');
  
  const [assignments, setAssignments] = useState<Assignment[]>(() => getStoredAssignments(currentUser.id));
  const [courses, setCourses] = useState<Course[]>(() => getStoredCourses(currentUser.id));
  const [events, setEvents] = useState<CalendarEvent[]>(() => getStoredEvents(currentUser.id));
  const [pomodoros, setPomodoros] = useState<PomodoroSession[]>(() => getStoredPomodoros(currentUser.id));
  const [notes, setNotes] = useState<Note[]>(() => getStoredNotes(currentUser.id));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getStoredNotifications(currentUser.id));
  
  // UI Dialog States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSyncingSchoology, setIsSyncingSchoology] = useState(false);

  // Apply accent color whenever accentColor changes
  useEffect(() => {
    applyAccentToRoot(accentColor);
  }, [accentColor]);

  // Load User Specific Data whenever currentUserId changes
  const loadUserData = useCallback((uid: string) => {
    const userPrefs = getStoredPreferences(uid);
    setPreferences(userPrefs);
    const userAccent = userPrefs.accentColor || 'blue';
    setAccentColorState(userAccent);
    applyAccentToRoot(userAccent);
    
    setAssignments(getStoredAssignments(uid));
    setCourses(getStoredCourses(uid));
    setEvents(getStoredEvents(uid));
    setPomodoros(getStoredPomodoros(uid));
    setNotes(getStoredNotes(uid));
    setNotifications(getStoredNotifications(uid));
  }, []);

  // Switch User
  const switchUser = (userId: string) => {
    saveCurrentUserId(userId);
    setCurrentUserIdState(userId);
    loadUserData(userId);
  };

  // Login
  const loginUser = (email: string, name?: string) => {
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      switchUser(existing.id);
    } else {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        createdAt: new Date().toISOString(),
        accentColor: 'blue',
      };
      saveUser(newUser);
      setAllUsers(getStoredUsers());
      switchUser(newUser.id);
    }
    setIsAuthModalOpen(false);
  };

  // Register
  const registerUser = (email: string, name: string, school?: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      school: school || 'University',
      createdAt: new Date().toISOString(),
      accentColor: 'blue',
    };
    saveUser(newUser);
    setAllUsers(getStoredUsers());
    switchUser(newUser.id);
    setIsAuthModalOpen(false);
  };

  // Logout
  const logoutUser = () => {
    loginUser('guest.student@scholar.edu', 'Guest Student');
  };

  // Accent Switcher
  const setAccentColor = (color: AccentTheme) => {
    setAccentColorState(color);
    applyAccentToRoot(color);
    
    // Update preference & user
    const updatedPrefs = { ...preferences, accentColor: color };
    setPreferences(updatedPrefs);
    saveStoredPreferences(currentUser.id, updatedPrefs);

    const updatedUser = { ...currentUser, accentColor: color };
    saveUser(updatedUser);
    setAllUsers(getStoredUsers());
  };

  const updatePreferences = (updated: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...updated };
    setPreferences(newPrefs);
    saveStoredPreferences(currentUser.id, newPrefs);
  };

  // Notification helper
  const addNotification = useCallback((title: string, message: string, type: NotificationItem['type'], linkView?: string) => {
    const newItem: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      linkView,
    };
    setNotifications(prev => {
      const updated = [newItem, ...prev];
      saveStoredNotifications(currentUser.id, updated);
      return updated;
    });
  }, [currentUser.id]);

  // Assignments CRUD
  const addAssignment = (asg: Omit<Assignment, 'id' | 'userId'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg_${Date.now()}`,
      userId: currentUser.id,
    };
    const updated = [newAsg, ...assignments];
    setAssignments(updated);
    saveStoredAssignments(currentUser.id, updated);

    // Auto add calendar event if google cal connected
    if (preferences.googleCal.connected && preferences.googleCal.autoExportAssignments) {
      const newEvt: CalendarEvent = {
        id: `evt_asg_${newAsg.id}`,
        userId: currentUser.id,
        title: `[Due] ${newAsg.title}`,
        type: 'assignment',
        courseId: newAsg.courseId,
        startDate: `${newAsg.dueDate}T${newAsg.dueTime || '23:59'}:00`,
        description: newAsg.description,
        googleCalSynced: true,
      };
      setEvents(prev => {
        const evts = [newEvt, ...prev];
        saveStoredEvents(currentUser.id, evts);
        return evts;
      });
    }

    addNotification('New Assignment Created', `"${newAsg.title}" added to your planner.`, 'assignment', 'assignments');
    return newAsg;
  };

  const updateAssignment = (id: string, updatedFields: Partial<Assignment>) => {
    const updated = assignments.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    setAssignments(updated);
    saveStoredAssignments(currentUser.id, updated);
  };

  const deleteAssignment = (id: string) => {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);
    saveStoredAssignments(currentUser.id, updated);
  };

  // Courses CRUD
  const addCourse = (course: Omit<Course, 'id' | 'userId'>) => {
    const newCourse: Course = {
      ...course,
      id: `course_${Date.now()}`,
      userId: currentUser.id,
    };
    const updated = [...courses, newCourse];
    setCourses(updated);
    saveStoredCourses(currentUser.id, updated);
    addNotification('New Class Added', `Course "${newCourse.name} (${newCourse.code})" enrolled.`, 'schoology', 'subjects');
    return newCourse;
  };

  const updateCourse = (id: string, updatedFields: Partial<Course>) => {
    const updated = courses.map(c => c.id === id ? { ...c, ...updatedFields } : c);
    setCourses(updated);
    saveStoredCourses(currentUser.id, updated);
  };

  const deleteCourse = (id: string) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    saveStoredCourses(currentUser.id, updated);
  };

  // Events CRUD
  const addEvent = (evt: Omit<CalendarEvent, 'id' | 'userId'>) => {
    const newEvt: CalendarEvent = {
      ...evt,
      id: `evt_${Date.now()}`,
      userId: currentUser.id,
      googleCalSynced: preferences.googleCal.connected,
    };
    const updated = [newEvt, ...events];
    setEvents(updated);
    saveStoredEvents(currentUser.id, updated);
    addNotification('Calendar Event Scheduled', `"${newEvt.title}" added to calendar.`, 'reminder', 'calendar');
    return newEvt;
  };

  const updateEvent = (id: string, updatedFields: Partial<CalendarEvent>) => {
    const updated = events.map(e => e.id === id ? { ...e, ...updatedFields } : e);
    setEvents(updated);
    saveStoredEvents(currentUser.id, updated);
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveStoredEvents(currentUser.id, updated);
  };

  // Pomodoro
  const addPomodoroSession = (session: Omit<PomodoroSession, 'id' | 'userId' | 'completedAt'>) => {
    const newPomo: PomodoroSession = {
      ...session,
      id: `pomo_${Date.now()}`,
      userId: currentUser.id,
      completedAt: new Date().toISOString(),
    };
    const updated = [newPomo, ...pomodoros];
    setPomodoros(updated);
    saveStoredPomodoros(currentUser.id, updated);
    addNotification('Focus Session Completed 🎉', `Logged ${newPomo.durationMinutes} mins of deep study time.`, 'timer', 'study');
  };

  // Notes
  const addNote = (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      userId: currentUser.id,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveStoredNotes(currentUser.id, updated);
    return newNote;
  };

  const updateNote = (id: string, updatedFields: Partial<Note>) => {
    const updated = notes.map(n => n.id === id ? { ...n, ...updatedFields, updatedAt: new Date().toISOString() } : n);
    setNotes(updated);
    saveStoredNotes(currentUser.id, updated);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveStoredNotes(currentUser.id, updated);
  };

  // Notification actions
  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveStoredNotifications(currentUser.id, updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(currentUser.id, updated);
  };

  const clearNotifications = () => {
    setNotifications([]);
    saveStoredNotifications(currentUser.id, []);
  };

  // Schoology Live Sync Simulator
  const syncSchoologyNow = async () => {
    setIsSyncingSchoology(true);
    await new Promise(res => setTimeout(res, 1800));

    // Simulated imported assignment from Schoology
    const importedAsg: Assignment = {
      id: `asg_sch_${Date.now()}`,
      userId: currentUser.id,
      title: 'Schoology Auto-Sync: Advanced Algorithm Complexity',
      courseId: courses[0]?.id || 'course_cs106b',
      description: 'Imported from Schoology LMS feed. Analyze master theorem recurrence relations.',
      dueDate: formatDateOffset(4),
      dueTime: '23:59',
      priority: 'high',
      estimatedMinutes: 75,
      status: 'todo',
      tags: ['Schoology', 'Imported', 'Algorithms'],
      checklist: [
        { id: 'sch_chk_1', text: 'Solve recurrence T(n) = 2T(n/2) + O(n)', completed: false },
      ],
      schoologyId: `sch_sync_${Date.now()}`,
      reminderTime: '1d',
    };

    setAssignments(prev => {
      const updated = [importedAsg, ...prev];
      saveStoredAssignments(currentUser.id, updated);
      return updated;
    });

    const updatedPrefs = {
      ...preferences,
      schoology: {
        ...preferences.schoology,
        connected: true,
        lastSynced: new Date().toISOString(),
      },
    };
    updatePreferences(updatedPrefs);
    setIsSyncingSchoology(false);

    addNotification(
      'Schoology Sync Successful',
      'Imported 1 new assignment & synchronized course rosters.',
      'schoology',
      'assignments'
    );
  };

  // Google Calendar Sync Simulator
  const syncGoogleCalendarNow = async () => {
    await new Promise(res => setTimeout(res, 1200));
    const updatedPrefs = {
      ...preferences,
      googleCal: {
        ...preferences.googleCal,
        connected: true,
        lastSynced: new Date().toISOString(),
      },
    };
    updatePreferences(updatedPrefs);
    addNotification(
      'Google Calendar Synced',
      'All assignments and exam deadlines are mapped to your Google Calendar.',
      'google_cal',
      'calendar'
    );
  };

  // Export User Data
  const exportUserDataJSON = () => {
    const exportObject = {
      user: currentUser,
      preferences,
      assignments,
      courses,
      events,
      pomodoros,
      notes,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(exportObject, null, 2);
  };

  // Import User Data
  const importUserDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.assignments) setAssignments(parsed.assignments);
      if (parsed.courses) setCourses(parsed.courses);
      if (parsed.events) setEvents(parsed.events);
      if (parsed.pomodoros) setPomodoros(parsed.pomodoros);
      if (parsed.notes) setNotes(parsed.notes);
      if (parsed.preferences) setPreferences(parsed.preferences);
      
      saveStoredAssignments(currentUser.id, parsed.assignments || assignments);
      saveStoredCourses(currentUser.id, parsed.courses || courses);
      saveStoredEvents(currentUser.id, parsed.events || events);
      saveStoredPomodoros(currentUser.id, parsed.pomodoros || pomodoros);
      saveStoredNotes(currentUser.id, parsed.notes || notes);
      if (parsed.preferences) saveStoredPreferences(currentUser.id, parsed.preferences);

      addNotification('Data Backup Restored', 'Successfully loaded data backup into Scholar.', 'reminder');
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        loginUser,
        registerUser,
        logoutUser,
        currentView,
        setCurrentView,
        accentColor,
        setAccentColor,
        preferences,
        updatePreferences,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        pomodoros,
        addPomodoroSession,
        notes,
        addNote,
        updateNote,
        deleteNote,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        addNotification,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isSyncingSchoology,
        syncSchoologyNow,
        syncGoogleCalendarNow,
        exportUserDataJSON,
        importUserDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
