import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

/* ─── Default seed forms so the app has data out of the box ─── */
const SEED_FORMS = [
    {
        id: 'campaign-seed-1',
        title: 'FSAD Course & Instructor Evaluation',
        description: 'Provide feedback on course quality and instructor performance.',
        createdAt: '2026-02-20T10:00:00.000Z',
        deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        published: true,
        type: 'Course',
        target: 'Foundations of Software Application Development',
        course: 'FSAD',
        fields: [
            { id: 'f1', label: 'How well did the instructor explain the subject concepts?', type: 'rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { id: 'f2', label: 'How clear were the lecture presentations?', type: 'rating', required: true, options: ['Very Clear', 'Clear', 'Somewhat Clear', 'Not Clear'] },
            { id: 'f3', label: 'How useful were the study materials provided for the subject?', type: 'rating', required: true, options: ['Very Useful', 'Useful', 'Slightly Useful', 'Not Useful'] },
            { id: 'f4', label: 'How effectively were doubts and questions addressed during the class?', type: 'rating', required: true, options: ['Very Effectively', 'Effectively', 'Moderately', 'Not Effectively'] },
            { id: 'f5', label: 'Overall, how would you rate this subject?', type: 'rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
        ],
    },
    {
        id: 'campaign-seed-2',
        title: 'Course Quality Evaluation – DBMS',
        description: 'End of semester course quality evaluation for Database Management Systems.',
        createdAt: '2026-02-01T10:00:00.000Z',
        deadline: '2026-03-25',
        published: true,
        type: 'Course',
        target: 'Database Management Systems',
        course: 'DBMS',
        fields: [
            { id: 'f1', label: 'How well did the instructor explain the subject concepts?', type: 'rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { id: 'f2', label: 'How clear were the lecture presentations?', type: 'rating', required: true, options: ['Very Clear', 'Clear', 'Somewhat Clear', 'Not Clear'] },
            { id: 'f3', label: 'How useful were the study materials provided for the subject?', type: 'rating', required: true, options: ['Very Useful', 'Useful', 'Slightly Useful', 'Not Useful'] },
            { id: 'f4', label: 'How effectively were doubts and questions addressed during the class?', type: 'rating', required: true, options: ['Very Effectively', 'Effectively', 'Moderately', 'Not Effectively'] },
            { id: 'f5', label: 'Overall, how would you rate this subject?', type: 'rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
        ],
    },
    {
        id: 'campaign-seed-4',
        title: 'Institutional Services Feedback',
        description: 'Share your experience with institutional support and services.',
        createdAt: '2026-02-05T10:00:00.000Z',
        deadline: '2026-03-30',
        published: true,
        type: 'Institution',
        target: 'All Students',
        fields: [
            { id: 'f1', label: 'How well did the instructor explain the subject concepts?', type: 'rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { id: 'f2', label: 'How clear were the lecture presentations?', type: 'rating', required: true, options: ['Very Clear', 'Clear', 'Somewhat Clear', 'Not Clear'] },
            { id: 'f3', label: 'How useful were the study materials provided for the subject?', type: 'rating', required: true, options: ['Very Useful', 'Useful', 'Slightly Useful', 'Not Useful'] },
            { id: 'f4', label: 'How effectively were doubts and questions addressed during the class?', type: 'rating', required: true, options: ['Very Effectively', 'Effectively', 'Moderately', 'Not Effectively'] },
            { id: 'f5', label: 'Overall, how would you rate this subject?', type: 'rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
        ],
    },
    {
        id: 'campaign-seed-5',
        title: 'Advanced Feedback Survey – OS',
        description: 'Comprehensive evaluation for Operating Systems.',
        createdAt: '2026-02-20T10:00:00.000Z',
        deadline: '2026-04-15',
        published: true,
        type: 'Course',
        target: 'Operating Systems',
        course: 'OS',
        fields: [
            { id: 'f1', label: 'How well did the instructor explain the subject concepts?', type: 'rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { id: 'f2', label: 'How clear were the lecture presentations?', type: 'rating', required: true, options: ['Very Clear', 'Clear', 'Somewhat Clear', 'Not Clear'] },
            { id: 'f3', label: 'How useful were the study materials provided for the subject?', type: 'rating', required: true, options: ['Very Useful', 'Useful', 'Slightly Useful', 'Not Useful'] },
            { id: 'f4', label: 'How effectively were doubts and questions addressed during the class?', type: 'rating', required: true, options: ['Very Effectively', 'Effectively', 'Moderately', 'Not Effectively'] },
            { id: 'f5', label: 'Overall, how would you rate this subject?', type: 'rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
        ],
    },
];

/* ─── Helpers ─── */
const load = (key, fallback) => {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
};
const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
};

/* ─── Context ─── */
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [forms, setForms] = useState(() => {
        // Use a version key to force refresh seed forms when they're updated
        const SEED_VERSION = 'v7';
        const storedVersion = localStorage.getItem('edu_forms_version');
        if (storedVersion !== SEED_VERSION) {
            save('edu_forms', SEED_FORMS);
            localStorage.setItem('edu_forms_version', SEED_VERSION);
            return SEED_FORMS;
        }
        return load('edu_forms', SEED_FORMS);
    });

    const [courses, setCourses] = useState(() => {
        const defaultCourses = [
            { name: 'FSAD', code: '24SDC02E', credits: 4, courseName: 'Foundations of Software Application Development', instructor: 'Ramu', released: true },
            { name: 'CIS', code: '24CS220A', credits: 3, courseName: 'Computer Science', instructor: 'Ganesh', released: true },
            { name: 'DBMS', code: '24DBMS301', credits: 4, courseName: 'Database Management Systems', instructor: 'Abhinav', released: true },
            { name: 'OS', code: '24OSS401', credits: 3, courseName: 'Operating Systems', instructor: 'Raghavendra', released: true },
            { name: 'AIML', code: '24AML501', credits: 3, courseName: 'Artificial Intelligence', instructor: 'Sai', released: true },
        ];
        return load('edu_courses', defaultCourses);
    });


    const courseInstructors = useMemo(() => {
        const mapping = {};
        courses.forEach(c => {
            if (!mapping[c.name]) mapping[c.name] = [];
            mapping[c.name].push(c.instructor);
        });
        return mapping;
    }, [courses]);

    const releasedCourses = useMemo(() => 
        courses.filter(c => c.released).map(c => c.name),
        [courses]
    );

    const toggleCourseRelease = useCallback((courseName) => {
        setCourses(prev => prev.map(c => 
            c.name === courseName ? { ...c, released: !c.released } : c
        ));
    }, []);

    const [feedbacks, setFeedbacks] = useState([]);

    // submissions: { [submissionKey]: number } - kept for backward compatibility and fast "already submitted" checks
    const [submissionCounts, setSubmissionCounts] = useState({ 'fb-fsad-ramu': 12, 'fb-cis-ganesh': 8 });

    // track which keys this student has already submitted in this session
    const [submittedByStudent, setSubmittedByStudent] = useState({});

    const availableInstructors = useMemo(() => 
        [...new Set(courses.map(c => c.instructor))],
        [courses]
    );

    const availableCourses = useMemo(() => 
        courses.map(c => c.name),
        [courses]
    );


    // Track the currently logged in user (student or admin)
    const [currentUser, setCurrentUser] = useState(() => load('edu_current_user', null));

    // Dark mode state
    const [darkMode, setDarkMode] = useState(() => load('edu_dark_mode', false));

    // Apply dark mode theme to document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        save('edu_dark_mode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);

    // Keep submissions session-only by clearing any legacy persisted entries.
    useEffect(() => {
        try {
            localStorage.removeItem('edu_feedbacks');
            localStorage.removeItem('edu_submission_counts');
            localStorage.removeItem('edu_student_submitted');
        } catch { }
    }, []);

    // Notifications state
    const [notifications, setNotifications] = useState(() => {
        const stored = load('edu_notifications', []);
        if (stored.length === 0) {
            const seedNotifs = [
                {
                    id: 'notif-seed-1',
                    type: 'new_campaign',
                    message: 'New feedback form published: "Mid-Semester Course Feedback"',
                    metadata: { formId: 'campaign-seed-1' },
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    read: false
                },
                {
                    id: 'notif-seed-2',
                    type: 'alert',
                    message: 'Reminder: The "End-Semester Evaluation" deadline is approaching!',
                    metadata: { formId: 'campaign-seed-2' },
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    read: true
                }
            ];
            save('edu_notifications', seedNotifs);
            return seedNotifs;
        }
        return stored;
    });

    // Register of all users (persisted)
    const [users, setUsers] = useState(() => {
        const stored = load('edu_users', []);
        if (stored.length === 0) {
            // Default seed users
            const seedUsers = [
                { id: '2400030040', name: 'Aravind', username: 'aravind', password: 'student123', role: 'student', dept: 'Computer Science', semester: '6th Semester', email: 'aravind@edu.com' },
                { id: '2400030439', name: 'Jaswanth', username: 'jaswanth', password: 'student123', role: 'student', dept: 'Computer Science', semester: '6th Semester', email: 'jaswanth@edu.com' },
                { id: '2400032357', name: 'Anish', username: 'anish', password: 'student123', role: 'student', dept: 'Computer Science', semester: '6th Semester', email: 'anish@edu.com' },
                { id: 'admin-ram', name: 'Ram', username: 'ram', password: 'admin123', role: 'admin', email: 'admin@edu.com' },
            ];
            save('edu_users', seedUsers);
            return seedUsers;
        }
        return stored;
    });

    // Persist whenever state changes
    useEffect(() => { save('edu_forms', forms); }, [forms]);
    useEffect(() => { save('edu_courses', courses); }, [courses]);
    useEffect(() => { save('edu_current_user', currentUser); }, [currentUser]);
    useEffect(() => { save('edu_users', users); }, [users]);
    useEffect(() => { save('edu_notifications', notifications); }, [notifications]);

    /* ── Auth: Login / Logout ── */
    const loginUser = useCallback((user) => {
        setCurrentUser(user);
    }, []);

    const logoutUser = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const registerUser = useCallback((userData) => {
        const newUser = {
            ...userData,
            id: userData.id || `user-${Date.now()}`,
        };
        setUsers(prev => [...prev, newUser]);
        return newUser;
    }, []);

    const deleteUser = useCallback((userId) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    }, []);

    const findUserByEmail = useCallback((email) => {
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }, [users]);

    const validateUser = useCallback((username, password, role) => {
        return users.find(u =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === password &&
            u.role === role
        );
    }, [users]);

    /* ── Notifications ── */
    const addNotification = useCallback((type, message, metadata = {}) => {
        const newNotif = {
            id: `notif-${Date.now()}`,
            type,
            message,
            metadata,
            timestamp: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 20)); // Keep last 20
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    /* ── Admin: create / delete form ── */
    const createForm = useCallback((formData) => {
        const newForm = {
            ...formData,
            id: `form-${Date.now()}`,
            createdAt: new Date().toISOString(),
            published: true,
        };
        setForms(prev => [newForm, ...prev]);

        // Trigger notification for students
        addNotification('new_campaign', `New feedback form published: "${newForm.title}"`, { formId: newForm.id });

        return newForm.id;
    }, [addNotification]);

    const deleteForm = useCallback((id) => {
        setForms(prev => prev.filter(f => f.id !== id));
        setSubmissionCounts(prev => { const n = { ...prev }; delete n[id]; return n; });
    }, []);

    /* ── Student: submit feedback ── */
    const submitForm = useCallback((submissionKey, feedbackData) => {
        if (!submissionKey || !currentUser?.id) return;

        // Increment count
        setSubmissionCounts(prev => {
            return { ...prev, [submissionKey]: (prev[submissionKey] || 0) + 1 };
        });

        // Save detailed feedback if provided
        if (feedbackData) {
            setFeedbacks(prev => {
                return [{
                    id: `fb-${Date.now()}`,
                    ...feedbackData,
                    timestamp: new Date().toISOString()
                }, ...prev];
            });
        }

        // Track submissions per logged-in student instead of globally.
        setSubmittedByStudent(prev => {
            const userKey = currentUser.id;
            const existing = Array.isArray(prev[userKey]) ? prev[userKey] : [];
            return {
                ...prev,
                [userKey]: [...new Set([...existing, submissionKey])],
            };
        });
    }, [currentUser]);

    const hasStudentSubmitted = useCallback(
        (submissionKey) => {
            if (!currentUser?.id) return false;
            const submittedKeys = submittedByStudent[currentUser.id] || [];
            return submittedKeys.includes(submissionKey);
        },
        [currentUser, submittedByStudent]
    );

    /* ── Derived stats ── */
    const totalForms = forms.length;
    const totalSubmissions = Object.values(submissionCounts).reduce((a, b) => a + b, 0);
    const publishedForms = forms.filter(f => f.published);

    return (
        <AppContext.Provider value={{
            forms, publishedForms,
            courses, releasedCourses, toggleCourseRelease,
            availableCourses, availableInstructors, courseInstructors,
            feedbacks,
            submissionCounts,
            totalForms, totalSubmissions,
            createForm, deleteForm,
            submitForm, hasStudentSubmitted,
            darkMode, toggleDarkMode,
            currentUser, loginUser, logoutUser,
            users, registerUser, deleteUser, findUserByEmail, validateUser,
            notifications, markAllRead, clearNotifications,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside AppProvider');
    return ctx;
};
