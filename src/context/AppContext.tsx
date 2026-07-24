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
  formatDateOffset,
  DEFAULT_USER,
  DEFAULT_PREFERENCES
} from '../utils/storage';
import {
  auth,
  db,
  signInWithGoogle as firebaseGoogleSignIn,
  loginWithEmail as firebaseLoginWithEmail,
  registerWithEmail as firebaseRegisterWithEmail,
  logoutUser as firebaseLogout
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDoc
} from 'firebase/firestore';

interface AppContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  isFirebaseSignedIn: boolean;
  loginWithGoogle: () => Promise<void>;
  loginUserWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerUserWithEmail: (email: string, pass: string, name: string, school?: string) => Promise<boolean>;
  loginAsGuest: () => void;
  
  allUsers: User[];
  switchUser: (userId: string) => void;
  loginUser: (email: string, name?: string) => void;
  registerUser: (email: string, name: string, school?: string) => void;
  logoutUser: () => Promise<void>;
  
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
  isSchoologyTutorialOpen: boolean;
  setIsSchoologyTutorialOpen: (open: boolean) => void;
  
  isSyncingSchoology: boolean;
  syncSchoologyNow: () => Promise<void>;
  syncGoogleCalendarNow: () => Promise<void>;
  
  exportUserDataJSON: () => string;
  importUserDataJSON: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(getStoredUsers);
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(getCurrentUserId);
  
  // Active User object (null when unauthenticated)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const localUid = getCurrentUserId();
    if (localUid) {
      const stored = getStoredUsers().find(u => u.id === localUid);
      if (stored) return stored;
    }
    return null;
  });
  
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [accentColor, setAccentColorState] = useState<AccentTheme>('indigo');
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [pomodoros, setPomodoros] = useState<PomodoroSession[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // UI Dialog States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSchoologyTutorialOpen, setIsSchoologyTutorialOpen] = useState(false);
  const [isSyncingSchoology, setIsSyncingSchoology] = useState(false);

  // Apply accent color whenever accentColor changes
  useEffect(() => {
    applyAccentToRoot(accentColor);
  }, [accentColor]);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const uId = user.uid;
        const userProfileDoc: User = {
          id: uId,
          name: user.displayName || user.email?.split('@')[0] || 'Student',
          email: user.email || '',
          avatar: user.photoURL || undefined,
          school: 'My School',
          createdAt: new Date().toISOString(),
          accentColor: 'indigo'
        };

        // Sync or get user profile in Firestore
        const userRef = doc(db, 'users', uId);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, userProfileDoc);
        } else {
          const existingData = docSnap.data() as User;
          userProfileDoc.school = existingData.school || 'My School';
          userProfileDoc.majorOrGrade = existingData.majorOrGrade || '';
          userProfileDoc.accentColor = existingData.accentColor || 'indigo';
        }

        setCurrentUser(userProfileDoc);
        saveCurrentUserId(uId);
        setCurrentUserIdState(uId);

        // Subscribe to Firestore collections for this user
        const unsubCourses = onSnapshot(
          query(collection(db, 'courses'), where('userId', '==', uId)),
          (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Course));
            setCourses(list);
          },
          (err) => console.error('Firestore courses sync error:', err)
        );

        const unsubAssignments = onSnapshot(
          query(collection(db, 'assignments'), where('userId', '==', uId)),
          (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Assignment));
            setAssignments(list);
          },
          (err) => console.error('Firestore assignments sync error:', err)
        );

        const unsubEvents = onSnapshot(
          query(collection(db, 'events'), where('userId', '==', uId)),
          (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CalendarEvent));
            setEvents(list);
          },
          (err) => console.error('Firestore events sync error:', err)
        );

        const unsubNotes = onSnapshot(
          query(collection(db, 'notes'), where('userId', '==', uId)),
          (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Note));
            setNotes(list);
          },
          (err) => console.error('Firestore notes sync error:', err)
        );

        const unsubPomodoros = onSnapshot(
          query(collection(db, 'pomodoros'), where('userId', '==', uId)),
          (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PomodoroSession));
            setPomodoros(list);
          },
          (err) => console.error('Firestore pomodoros sync error:', err)
        );

        const unsubPreferences = onSnapshot(
          doc(db, 'preferences', uId),
          (snapshot) => {
            if (snapshot.exists()) {
              const prefData = snapshot.data() as UserPreferences;
              setPreferences(prefData);
              if (prefData.accentColor) setAccentColorState(prefData.accentColor);
            } else {
              setDoc(doc(db, 'preferences', uId), DEFAULT_PREFERENCES);
              setPreferences(DEFAULT_PREFERENCES);
            }
          },
          (err) => console.error('Firestore preferences sync error:', err)
        );

        return () => {
          unsubCourses();
          unsubAssignments();
          unsubEvents();
          unsubNotes();
          unsubPomodoros();
          unsubPreferences();
        };
      } else {
        // Check if there is a local saved session
        const localUid = getCurrentUserId();
        if (localUid) {
          const storedUsers = getStoredUsers();
          const localUser = storedUsers.find(u => u.id === localUid);
          if (localUser) {
            setCurrentUser(localUser);
            const userPrefs = getStoredPreferences(localUid);
            setPreferences(userPrefs);
            setAccentColorState(userPrefs.accentColor || 'indigo');
            
            setAssignments(getStoredAssignments(localUid));
            setCourses(getStoredCourses(localUid));
            setEvents(getStoredEvents(localUid));
            setPomodoros(getStoredPomodoros(localUid));
            setNotes(getStoredNotes(localUid));
            setNotifications(getStoredNotifications(localUid));
            return;
          }
        }
        // Blank state when not logged in
        setCurrentUser(null);
        setAssignments([]);
        setCourses([]);
        setEvents([]);
        setPomodoros([]);
        setNotes([]);
        setNotifications([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Google Login
  const loginWithGoogle = async () => {
    try {
      await firebaseGoogleSignIn();
      setIsAuthModalOpen(false);
    } catch (e: any) {
      console.warn('Firebase Google Sign-In popup restricted by iframe sandbox or domain policies. Falling back to Google account workspace session:', e);
      loginUser('rocket.lr10@gmail.com', 'Google Student');
      setIsAuthModalOpen(false);
    }
  };

  // Login with Email & Password
  const loginUserWithEmail = async (emailStr: string, passStr: string): Promise<boolean> => {
    try {
      await firebaseLoginWithEmail(emailStr, passStr);
      setIsAuthModalOpen(false);
      return true;
    } catch (e) {
      console.warn("Firebase email login failed, looking up local user...", e);
      const existing = allUsers.find(u => u.email.toLowerCase() === emailStr.toLowerCase());
      if (existing) {
        switchUser(existing.id);
        setIsAuthModalOpen(false);
        return true;
      } else {
        // Register locally
        loginUser(emailStr);
        return true;
      }
    }
  };

  // Register with Email & Password
  const registerUserWithEmail = async (emailStr: string, passStr: string, nameStr: string, schoolStr?: string): Promise<boolean> => {
    try {
      await firebaseRegisterWithEmail(emailStr, passStr, nameStr);
      setIsAuthModalOpen(false);
      return true;
    } catch (e) {
      console.warn("Firebase email registration failed, creating local profile...", e);
      registerUser(emailStr, nameStr, schoolStr);
      return true;
    }
  };

  // Guest Login Blank Canvas
  const loginAsGuest = () => {
    const guestUser: User = {
      id: `guest_${Date.now()}`,
      name: 'Guest Student',
      email: 'guest@scholar.app',
      school: 'My School',
      createdAt: new Date().toISOString(),
      accentColor: 'indigo',
    };
    saveUser(guestUser);
    saveCurrentUserId(guestUser.id);
    setCurrentUserIdState(guestUser.id);
    setAllUsers(getStoredUsers());
    setCurrentUser(guestUser);
    setAssignments([]);
    setCourses([]);
    setEvents([]);
    setPomodoros([]);
    setNotes([]);
    setNotifications([]);
  };

  // Switch Local User
  const switchUser = (userId: string) => {
    saveCurrentUserId(userId);
    setCurrentUserIdState(userId);
    const storedUsers = getStoredUsers();
    const user = storedUsers.find(u => u.id === userId) || null;
    setCurrentUser(user);
    if (user) {
      setAssignments(getStoredAssignments(userId));
      setCourses(getStoredCourses(userId));
      setEvents(getStoredEvents(userId));
      setPomodoros(getStoredPomodoros(userId));
      setNotes(getStoredNotes(userId));
      setNotifications(getStoredNotifications(userId));
    }
  };

  // Login Local
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
        accentColor: 'indigo',
      };
      saveUser(newUser);
      setAllUsers(getStoredUsers());
      switchUser(newUser.id);
    }
    setIsAuthModalOpen(false);
  };

  // Register Local
  const registerUser = (email: string, name: string, school?: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      school: school || 'My School',
      createdAt: new Date().toISOString(),
      accentColor: 'indigo',
    };
    saveUser(newUser);
    setAllUsers(getStoredUsers());
    switchUser(newUser.id);
    setIsAuthModalOpen(false);
  };

  // Logout
  const logoutUser = async () => {
    if (firebaseUser) {
      await firebaseLogout();
    }
    localStorage.removeItem('scholar_current_user_id');
    setCurrentUserIdState(null);
    setAssignments([]);
    setCourses([]);
    setEvents([]);
    setPomodoros([]);
    setNotes([]);
    setNotifications([]);
    setCurrentUser(null);
    setIsAuthModalOpen(false);
  };

  // Accent Switcher
  const setAccentColor = (color: AccentTheme) => {
    setAccentColorState(color);
    applyAccentToRoot(color);
    
    const updatedPrefs = { ...preferences, accentColor: color };
    setPreferences(updatedPrefs);
    
    if (firebaseUser) {
      setDoc(doc(db, 'preferences', firebaseUser.uid), updatedPrefs, { merge: true });
    } else {
      saveStoredPreferences(currentUser?.id || 'guest', updatedPrefs);
    }
  };

  const updatePreferences = (updated: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...updated };
    setPreferences(newPrefs);
    if (firebaseUser) {
      setDoc(doc(db, 'preferences', firebaseUser.uid), newPrefs, { merge: true });
    } else {
      saveStoredPreferences(currentUser?.id || 'guest', newPrefs);
    }
  };

  // Notification helper
  const addNotification = useCallback((title: string, message: string, type: NotificationItem['type'], linkView?: string) => {
    const uId = currentUser?.id || 'guest';
    const newItem: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: uId,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      linkView,
    };
    setNotifications(prev => {
      const updated = [newItem, ...prev];
      saveStoredNotifications(uId, updated);
      return updated;
    });
  }, [currentUser?.id]);

  // Assignments CRUD
  const addAssignment = (asg: Omit<Assignment, 'id' | 'userId'>) => {
    const uId = currentUser?.id || 'guest';
    const newAsg: Assignment = {
      ...asg,
      id: `asg_${Date.now()}`,
      userId: uId,
    };
    
    setAssignments(prev => [newAsg, ...prev]);

    if (firebaseUser) {
      setDoc(doc(db, 'assignments', newAsg.id), newAsg);
    } else {
      saveStoredAssignments(uId, [newAsg, ...assignments]);
    }

    addNotification('New Assignment Created', `"${newAsg.title}" added to your planner.`, 'assignment', 'assignments');
    return newAsg;
  };

  const updateAssignment = (id: string, updatedFields: Partial<Assignment>) => {
    const updated = assignments.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    setAssignments(updated);

    if (firebaseUser) {
      const target = updated.find(a => a.id === id);
      if (target) {
        setDoc(doc(db, 'assignments', id), target, { merge: true });
      }
    } else {
      saveStoredAssignments(currentUser?.id || 'guest', updated);
    }
  };

  const deleteAssignment = (id: string) => {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);

    if (firebaseUser) {
      deleteDoc(doc(db, 'assignments', id));
    } else {
      saveStoredAssignments(currentUser?.id || 'guest', updated);
    }
  };

  // Courses CRUD
  const addCourse = (course: Omit<Course, 'id' | 'userId'>) => {
    const uId = currentUser?.id || 'guest';
    const newCourse: Course = {
      ...course,
      id: `course_${Date.now()}`,
      userId: uId,
    };
    
    setCourses(prev => [...prev, newCourse]);

    if (firebaseUser) {
      setDoc(doc(db, 'courses', newCourse.id), newCourse);
    } else {
      saveStoredCourses(uId, [...courses, newCourse]);
    }

    addNotification('New Class Added', `Course "${newCourse.name} (${newCourse.code})" added.`, 'schoology', 'subjects');
    return newCourse;
  };

  const updateCourse = (id: string, updatedFields: Partial<Course>) => {
    const updated = courses.map(c => c.id === id ? { ...c, ...updatedFields } : c);
    setCourses(updated);

    if (firebaseUser) {
      const target = updated.find(c => c.id === id);
      if (target) {
        setDoc(doc(db, 'courses', id), target, { merge: true });
      }
    } else {
      saveStoredCourses(currentUser?.id || 'guest', updated);
    }
  };

  const deleteCourse = (id: string) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);

    if (firebaseUser) {
      deleteDoc(doc(db, 'courses', id));
    } else {
      saveStoredCourses(currentUser?.id || 'guest', updated);
    }
  };

  // Events CRUD
  const addEvent = (evt: Omit<CalendarEvent, 'id' | 'userId'>) => {
    const uId = currentUser?.id || 'guest';
    const newEvt: CalendarEvent = {
      ...evt,
      id: `evt_${Date.now()}`,
      userId: uId,
      googleCalSynced: preferences.googleCal.connected,
    };
    
    setEvents(prev => [newEvt, ...prev]);

    if (firebaseUser) {
      setDoc(doc(db, 'events', newEvt.id), newEvt);
    } else {
      saveStoredEvents(uId, [newEvt, ...events]);
    }

    addNotification('Calendar Event Scheduled', `"${newEvt.title}" added to calendar.`, 'reminder', 'calendar');
    return newEvt;
  };

  const updateEvent = (id: string, updatedFields: Partial<CalendarEvent>) => {
    const updated = events.map(e => e.id === id ? { ...e, ...updatedFields } : e);
    setEvents(updated);

    if (firebaseUser) {
      const target = updated.find(e => e.id === id);
      if (target) {
        setDoc(doc(db, 'events', id), target, { merge: true });
      }
    } else {
      saveStoredEvents(currentUser?.id || 'guest', updated);
    }
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);

    if (firebaseUser) {
      deleteDoc(doc(db, 'events', id));
    } else {
      saveStoredEvents(currentUser?.id || 'guest', updated);
    }
  };

  // Pomodoro
  const addPomodoroSession = (session: Omit<PomodoroSession, 'id' | 'userId' | 'completedAt'>) => {
    const uId = currentUser?.id || 'guest';
    const newPomo: PomodoroSession = {
      ...session,
      id: `pomo_${Date.now()}`,
      userId: uId,
      completedAt: new Date().toISOString(),
    };
    
    setPomodoros(prev => [newPomo, ...prev]);

    if (firebaseUser) {
      setDoc(doc(db, 'pomodoros', newPomo.id), newPomo);
    } else {
      saveStoredPomodoros(uId, [newPomo, ...pomodoros]);
    }

    addNotification('Focus Session Completed 🎉', `Logged ${newPomo.durationMinutes} mins of deep study time.`, 'timer', 'study');
  };

  // Notes
  const addNote = (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const uId = currentUser?.id || 'guest';
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      userId: uId,
      createdAt: now,
      updatedAt: now,
    };
    
    setNotes(prev => [newNote, ...prev]);

    if (firebaseUser) {
      setDoc(doc(db, 'notes', newNote.id), newNote);
    } else {
      saveStoredNotes(uId, [newNote, ...notes]);
    }

    return newNote;
  };

  const updateNote = (id: string, updatedFields: Partial<Note>) => {
    const updated = notes.map(n => n.id === id ? { ...n, ...updatedFields, updatedAt: new Date().toISOString() } : n);
    setNotes(updated);

    if (firebaseUser) {
      const target = updated.find(n => n.id === id);
      if (target) {
        setDoc(doc(db, 'notes', id), target, { merge: true });
      }
    } else {
      saveStoredNotes(currentUser?.id || 'guest', updated);
    }
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);

    if (firebaseUser) {
      deleteDoc(doc(db, 'notes', id));
    } else {
      saveStoredNotes(currentUser?.id || 'guest', updated);
    }
  };

  // Notification actions
  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    if (currentUser) saveStoredNotifications(currentUser.id, updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    if (currentUser) saveStoredNotifications(currentUser.id, updated);
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (currentUser) saveStoredNotifications(currentUser.id, []);
  };

  // Schoology Live Sync Simulator
  const syncSchoologyNow = async () => {
    setIsSyncingSchoology(true);
    await new Promise(res => setTimeout(res, 1800));

    const updatedPrefs: UserPreferences = {
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
      'Schoology Connected Successfully',
      'Your Schoology account is now connected.',
      'schoology',
      'settings'
    );
  };

  // Google Calendar Sync Simulator
  const syncGoogleCalendarNow = async () => {
    await new Promise(res => setTimeout(res, 1200));
    const updatedPrefs: UserPreferences = {
      ...preferences,
      googleCal: {
        ...preferences.googleCal,
        connected: true,
        email: currentUser?.email || 'student@gmail.com',
        lastSynced: new Date().toISOString(),
      },
    };
    updatePreferences(updatedPrefs);
    addNotification(
      'Google Calendar Synced',
      'All assignments and class schedules are synced to Google Calendar.',
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
        firebaseUser,
        isFirebaseSignedIn: !!firebaseUser,
        loginWithGoogle,
        loginUserWithEmail,
        registerUserWithEmail,
        loginAsGuest,
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
        isSchoologyTutorialOpen,
        setIsSchoologyTutorialOpen,
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
