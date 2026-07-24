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

// Default User
export const DEFAULT_USER: User = {
  id: 'user_alex_default',
  name: 'Alex Vance',
  email: 'alex.vance@stanford.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  school: 'Stanford University',
  majorOrGrade: 'Computer Science & Mathematics',
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
    connected: true,
    domain: 'schoology.stanford.edu',
    apiKey: 'sch_live_891f2k9a38x1',
    lastSynced: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    autoSync: true,
    syncIntervalMinutes: 30,
  },
  googleCal: {
    connected: true,
    email: 'alex.vance@stanford.edu',
    autoExportAssignments: true,
    lastSynced: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
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

// Initial Courses
const INITIAL_COURSES: Course[] = [
  {
    id: 'course_cs106b',
    userId: DEFAULT_USER.id,
    name: 'Data Structures & Algorithms',
    code: 'CS 106B',
    color: '#3B82F6', // Blue
    icon: 'Code',
    teacher: 'Prof. Jerry Cain',
    room: 'Gates B01',
    schedule: 'Mon, Wed, Fri • 10:30 AM',
    syllabus: 'Abstract data structures, recursion, dynamic programming, graph algorithms, and Big-O notation.',
    gradeAverage: 96.4,
    schoologyCourseId: 'sch_cs106b',
  },
  {
    id: 'course_math51',
    userId: DEFAULT_USER.id,
    name: 'Linear Algebra & Multivariable',
    code: 'MATH 51',
    color: '#A855F7', // Purple
    icon: 'Calculator',
    teacher: 'Dr. Sarah Roberts',
    room: 'Sloan Hall 380',
    schedule: 'Tue, Thu • 1:30 PM',
    syllabus: 'Vector spaces, eigenvalues, matrix transformations, partial derivatives, and optimization.',
    gradeAverage: 92.8,
    schoologyCourseId: 'sch_math51',
  },
  {
    id: 'course_phys41',
    userId: DEFAULT_USER.id,
    name: 'Mechanics & Relativity',
    code: 'PHYS 41',
    color: '#EC4899', // Pink
    icon: 'Atom',
    teacher: 'Prof. Mark Kasevich',
    room: 'Hewlett 200',
    schedule: 'Mon, Wed • 2:15 PM',
    syllabus: 'Newtonian mechanics, momentum conservation, rotational dynamics, and special relativity.',
    gradeAverage: 89.5,
    schoologyCourseId: 'sch_phys41',
  },
  {
    id: 'course_pols101',
    userId: DEFAULT_USER.id,
    name: 'Modern Political Thought',
    code: 'POLI 101',
    color: '#10B981', // Green
    icon: 'BookOpen',
    teacher: 'Dr. Elena Rostova',
    room: 'Main Quad Bldg 160',
    schedule: 'Tue, Thu • 9:00 AM',
    syllabus: 'Social contract theory, liberty, democratic institutions, and modern governance paradigms.',
    gradeAverage: 94.2,
    schoologyCourseId: 'sch_pols101',
  },
];

// Initial Assignments
const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    userId: DEFAULT_USER.id,
    title: 'Priority Queue & Heap Tree Implementation',
    courseId: 'course_cs106b',
    description: 'Implement a binary min-heap backed PriorityQueue class in C++ with O(log N) insertion and extraction.',
    dueDate: formatDateOffset(0), // Today
    dueTime: '23:59',
    priority: 'urgent',
    estimatedMinutes: 120,
    status: 'in_progress',
    tags: ['C++', 'Algorithms', 'PSet 4'],
    checklist: [
      { id: 'chk_1', text: 'Write node allocation logic', completed: true },
      { id: 'chk_2', text: 'Implement bubbleUp() & bubbleDown()', completed: true },
      { id: 'chk_3', text: 'Pass all unit stress tests', completed: false },
      { id: 'chk_4', text: 'Submit to Schoology autograder', completed: false },
    ],
    notes: 'Remember to check edge cases when extracting from empty queue.',
    schoologyId: 'sch_asg_101',
    googleCalEventId: 'gcal_asg_101',
    reminderTime: '3h',
  },
  {
    id: 'asg_2',
    userId: DEFAULT_USER.id,
    title: 'Problem Set 6: Eigenvalues & Diagonalization',
    courseId: 'course_math51',
    description: 'Complete problems 1-8 in Chapter 5. Prove characteristic polynomial roots.',
    dueDate: formatDateOffset(1), // Tomorrow
    dueTime: '17:00',
    priority: 'high',
    estimatedMinutes: 90,
    status: 'todo',
    tags: ['Matrices', 'Proof', 'Homework'],
    checklist: [
      { id: 'chk_5', text: 'Solve problems 1 to 4', completed: true },
      { id: 'chk_6', text: 'Prove Lemma 5.2 on symmetric matrices', completed: false },
      { id: 'chk_7', text: 'Scan & upload LaTeX document', completed: false },
    ],
    notes: 'Review Lecture 14 slides on SVD decomposition.',
    schoologyId: 'sch_asg_102',
    googleCalEventId: 'gcal_asg_102',
    reminderTime: '1d',
  },
  {
    id: 'asg_3',
    userId: DEFAULT_USER.id,
    title: 'Lab Report: Rotational Inertia Measurement',
    courseId: 'course_phys41',
    description: 'Analyze sensor dataset from Tuesday lab session. Calculate percentage error against theoretical moment.',
    dueDate: formatDateOffset(3),
    dueTime: '12:00',
    priority: 'medium',
    estimatedMinutes: 60,
    status: 'todo',
    tags: ['Lab', 'Physics', 'Python'],
    checklist: [
      { id: 'chk_8', text: 'Clean csv sensor dataset', completed: false },
      { id: 'chk_9', text: 'Plot torque vs angular acceleration in Matplotlib', completed: false },
      { id: 'chk_10', text: 'Write conclusion section', completed: false },
    ],
    notes: '',
    schoologyId: 'sch_asg_103',
    googleCalEventId: 'gcal_asg_103',
    reminderTime: '1d',
  },
  {
    id: 'asg_4',
    userId: DEFAULT_USER.id,
    title: 'Essay: Rousseau vs Hobbes on State of Nature',
    courseId: 'course_pols101',
    description: '1,500 word comparative analysis exploring human freedom and political obligation.',
    dueDate: formatDateOffset(5),
    dueTime: '23:59',
    priority: 'medium',
    estimatedMinutes: 180,
    status: 'in_progress',
    tags: ['Essay', 'Political Theory'],
    checklist: [
      { id: 'chk_11', text: 'Outline thesis statement', completed: true },
      { id: 'chk_12', text: 'Draft section 1: Leviathan analysis', completed: true },
      { id: 'chk_13', text: 'Draft section 2: Social Contract comparison', completed: false },
      { id: 'chk_14', text: 'Final proofread and Chicago citations', completed: false },
    ],
    notes: 'Include quotes from Leviathan Chapter 13.',
    schoologyId: 'sch_asg_104',
    googleCalEventId: 'gcal_asg_104',
    reminderTime: '3d',
  },
  {
    id: 'asg_5',
    userId: DEFAULT_USER.id,
    title: 'Midterm Exam 2 Preparation',
    courseId: 'course_cs106b',
    description: 'Review graph traversal (BFS/DFS), Dijkstra, and recursive backtracking past exams.',
    dueDate: formatDateOffset(-1), // Completed yesterday
    dueTime: '10:30',
    priority: 'urgent',
    estimatedMinutes: 150,
    status: 'completed',
    tags: ['Exam Prep', 'Review'],
    checklist: [
      { id: 'chk_15', text: 'Practice 2024 Practice Exam A', completed: true },
      { id: 'chk_16', text: 'Practice 2024 Practice Exam B', completed: true },
    ],
    notes: '',
  },
];

// Initial Calendar Events
const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt_1',
    userId: DEFAULT_USER.id,
    title: 'CS 106B Lecture: Graph Traversal',
    type: 'lecture',
    courseId: 'course_cs106b',
    startDate: `${formatDateOffset(0)}T10:30:00`,
    endDate: `${formatDateOffset(0)}T11:50:00`,
    location: 'Gates B01',
    description: 'Breadth-First Search and Depth-First Search applications in mazes.',
    googleCalSynced: true,
  },
  {
    id: 'evt_2',
    userId: DEFAULT_USER.id,
    title: 'MATH 51 Section: Linear Transformations',
    type: 'lecture',
    courseId: 'course_math51',
    startDate: `${formatDateOffset(0)}T13:30:00`,
    endDate: `${formatDateOffset(0)}T14:50:00`,
    location: 'Sloan 380',
    googleCalSynced: true,
  },
  {
    id: 'evt_3',
    userId: DEFAULT_USER.id,
    title: 'CS Study Group @ Green Library',
    type: 'study',
    courseId: 'course_cs106b',
    startDate: `${formatDateOffset(0)}T16:00:00`,
    endDate: `${formatDateOffset(0)}T18:00:00`,
    location: 'Green Library Bing Wing 204',
    description: 'Working together on Priority Queue memory leak debugging.',
    googleCalSynced: true,
  },
  {
    id: 'evt_4',
    userId: DEFAULT_USER.id,
    title: 'PHYS 41 Midterm Exam',
    type: 'exam',
    courseId: 'course_phys41',
    startDate: `${formatDateOffset(2)}T14:15:00`,
    endDate: `${formatDateOffset(2)}T15:45:00`,
    location: 'Hewlett Auditorium 200',
    description: 'Covers Chapters 1 to 7. Closed book, one double-sided formula sheet permitted.',
    googleCalSynced: true,
  },
  {
    id: 'evt_5',
    userId: DEFAULT_USER.id,
    title: 'POLI 101 Discussion Seminar',
    type: 'lecture',
    courseId: 'course_pols101',
    startDate: `${formatDateOffset(1)}T09:00:00`,
    endDate: `${formatDateOffset(1)}T10:20:00`,
    location: 'Bldg 160 Room 112',
    googleCalSynced: true,
  },
];

// Initial Pomodoro Sessions
const INITIAL_POMODOROS: PomodoroSession[] = [
  {
    id: 'pomo_1',
    userId: DEFAULT_USER.id,
    courseId: 'course_cs106b',
    durationMinutes: 25,
    sessionType: 'pomodoro',
    completedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    notes: 'Implemented MinHeap bubbleUp logic.',
  },
  {
    id: 'pomo_2',
    userId: DEFAULT_USER.id,
    courseId: 'course_cs106b',
    durationMinutes: 25,
    sessionType: 'pomodoro',
    completedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    notes: 'Fixed vector array index off-by-one bug.',
  },
  {
    id: 'pomo_3',
    userId: DEFAULT_USER.id,
    courseId: 'course_math51',
    durationMinutes: 25,
    sessionType: 'pomodoro',
    completedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    notes: 'Completed PSet 6 Matrix Eigenvalue proofs.',
  },
  {
    id: 'pomo_4',
    userId: DEFAULT_USER.id,
    courseId: 'course_phys41',
    durationMinutes: 45,
    sessionType: 'custom',
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    notes: 'Lab sensor data cleaning in Jupyter Notebook.',
  },
];

// Initial Notes
const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    userId: DEFAULT_USER.id,
    title: 'Graph Traversal & Backtracking Cheatsheet',
    courseId: 'course_cs106b',
    content: `# Graph Algorithms Quick Reference

## Depth-First Search (DFS)
* **Strategy:** Explores as deep as possible before backtracking.
* **Data Structure:** Explicit Stack or Function Call Recursion.
* **Time Complexity:** O(V + E)

\`\`\`cpp
void dfs(int u, vector<bool>& visited, vector<vector<int>>& adj) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, visited, adj);
        }
    }
}
\`\`\`

## Breadth-First Search (BFS)
* **Strategy:** Level-order exploration guarantees shortest path in unweighted graphs.
* **Data Structure:** Queue.
* **Key Check:** Mark nodes as visited immediately upon enqueueing to prevent duplicates!`,
    tags: ['CS106B', 'Algorithms', 'CPP'],
    pinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'note_2',
    userId: DEFAULT_USER.id,
    title: 'Linear Transformations & Matrix Representations',
    courseId: 'course_math51',
    content: `# MATH 51 Key Theorems

### 1. Invertible Matrix Theorem
A square $N \\times N$ matrix $A$ is invertible if and only if:
- $\\det(A) \\neq 0$
- Rank($A$) = $N$
- The columns of $A$ span $\\mathbb{R}^n$
- $\\text{Nullity}(A) = 0$

### 2. Eigenvalues and Eigenvectors
$A v = \\lambda v \\implies (A - \\lambda I) v = 0$
Solve $\\det(A - \\lambda I) = 0$ to find characteristic polynomial roots!`,
    tags: ['Math', 'Linear Algebra', 'Exam Prep'],
    pinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'note_3',
    userId: DEFAULT_USER.id,
    title: 'Semester Study Goals & Weekly Routine',
    content: `## Spring Quarter Objectives
- [x] Maintain 3.9+ GPA target across technical coursework
- [ ] Log at least 18 hours of deep focus study per week
- [x] Submit all Schoology assignments at least 12 hours before deadline
- [ ] Complete Physics lab reports by Thursday evening

### Weekly Focus Block Schedule:
- **M/W:** Morning CS coding blocks + Afternoon Physics
- **T/Th:** Linear algebra proofs + Political Theory reading
- **Fri:** Review sessions, backlog cleanup & weekend planning`,
    tags: ['Goals', 'Personal', 'Routine'],
    pinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: DEFAULT_USER.id,
    title: 'Assignment Due Today!',
    message: 'Priority Queue & Heap Tree Implementation is due tonight at 11:59 PM.',
    type: 'assignment',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    linkView: 'assignments',
  },
  {
    id: 'notif_2',
    userId: DEFAULT_USER.id,
    title: 'Schoology Sync Completed',
    message: 'Successfully imported 4 assignments and 1 course announcement.',
    type: 'schoology',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    linkView: 'settings',
  },
  {
    id: 'notif_3',
    userId: DEFAULT_USER.id,
    title: 'Google Calendar Event Created',
    message: 'Added CS Study Group @ Green Library to your Google Calendar.',
    type: 'google_cal',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    linkView: 'calendar',
  },
  {
    id: 'notif_4',
    userId: DEFAULT_USER.id,
    title: 'PHYS 41 Exam Reminder',
    message: 'Physics Midterm 2 is scheduled in 2 days at Hewlett 200.',
    type: 'reminder',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    linkView: 'calendar',
  },
];

// Helper Storage Getters / Setters
export function getStoredUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!data) {
    const users = [DEFAULT_USER];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER.id);
    return users;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [DEFAULT_USER];
  }
}

export function getCurrentUserId(): string {
  const current = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!current) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER.id);
    return DEFAULT_USER.id;
  }
  return current;
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
