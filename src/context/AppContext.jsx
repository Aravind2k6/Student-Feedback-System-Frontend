import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const SEED_FORMS = [
    {
        id: 'campaign-seed-1',
        title: 'FSAD Course & Instructor Evaluation',
        description: 'Provide feedback on course quality and instructor performance.',
        createdAt: '2026-02-20T10:00:00.000Z',
        deadline: '2026-03-24',
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
        title: 'Course Quality Evaluation - DBMS',
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
        title: 'Advanced Feedback Survey - OS',
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

const DEFAULT_COURSES = [
    { name: 'FSAD', code: '24SDC02E', credits: 4, courseName: 'Foundations of Software Application Development', instructor: 'Ramu', released: true },
    { name: 'CIS', code: '24CS220A', credits: 3, courseName: 'Computer Science', instructor: 'Ganesh', released: true },
    { name: 'DBMS', code: '24DBMS301', credits: 4, courseName: 'Database Management Systems', instructor: 'Abhinav', released: true },
    { name: 'OS', code: '24OSS401', credits: 3, courseName: 'Operating Systems', instructor: 'Raghavendra', released: true },
    { name: 'AIML', code: '24AML501', credits: 3, courseName: 'Artificial Intelligence', instructor: 'Sai', released: true },
];

const SEED_NOTIFICATIONS = [
    {
        id: 'notif-seed-1',
        type: 'new_campaign',
        message: 'New feedback form published: "Mid-Semester Course Feedback"',
        metadata: { formId: 'campaign-seed-1' },
        timestamp: '2026-03-17T10:00:00.000Z',
        read: false,
    },
    {
        id: 'notif-seed-2',
        type: 'alert',
        message: 'Reminder: The "End-Semester Evaluation" deadline is approaching!',
        metadata: { formId: 'campaign-seed-2' },
        timestamp: '2026-03-17T09:00:00.000Z',
        read: true,
    },
];

const SEED_USERS = [
    { id: '2400030040', name: 'Aravind', username: 'aravind', password: 'student123', role: 'student', dept: 'Computer Science', semester: '6th Semester', email: 'aravind@edu.com' },
    { id: '2400030439', name: 'Jaswanth', username: 'jaswanth', password: 'student123', role: 'student', dept: 'Computer Science', semester: '6th Semester', email: 'jaswanth@edu.com' },
    { id: '2400032357', name: 'Anish', username: 'anish', password: 'student123', role: 'student', dept: 'Computer Science', semester: '6th Semester', email: 'anish@edu.com' },
    { id: 'admin-ram', name: 'Ram', username: 'ram', password: 'admin123', role: 'admin', email: 'admin@edu.com' },
];

const APP_STATE_VERSION = 'v1';
const APP_STATE_VERSION_KEY = 'edu_app_state_version';
const STORAGE_KEYS_TO_RESET = [
    'edu_forms',
    'edu_forms_version',
    'edu_courses',
    'edu_current_user',
    'edu_dark_mode',
    'edu_notifications',
    'edu_users',
    'edu_feedbacks',
    'edu_submission_counts',
    'edu_student_submitted',
];

const DEFAULT_APP_STATE = {
    forms: SEED_FORMS,
    courses: DEFAULT_COURSES,
    currentUser: null,
    darkMode: false,
    notifications: SEED_NOTIFICATIONS,
    users: SEED_USERS,
};

const load = (key, fallback) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
};

const normalizeAuthValue = (value) => String(value || '').trim().toLowerCase();

const getUserLoginIdentifiers = (user) => {
    const identifiers = [user.username, user.email, user.name];

    if (user.role === 'admin') {
        identifiers.push('admin', 'administrator');
    }

    return [...new Set(identifiers.map(normalizeAuthValue).filter(Boolean))];
};

const save = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage write failures.
    }
};

const getInitialAppState = () => {
    try {
        const storedVersion = localStorage.getItem(APP_STATE_VERSION_KEY);

        if (storedVersion !== APP_STATE_VERSION) {
            STORAGE_KEYS_TO_RESET.forEach((key) => localStorage.removeItem(key));
            save('edu_forms', DEFAULT_APP_STATE.forms);
            save('edu_courses', DEFAULT_APP_STATE.courses);
            save('edu_current_user', DEFAULT_APP_STATE.currentUser);
            save('edu_dark_mode', DEFAULT_APP_STATE.darkMode);
            save('edu_notifications', DEFAULT_APP_STATE.notifications);
            save('edu_users', DEFAULT_APP_STATE.users);
            localStorage.setItem(APP_STATE_VERSION_KEY, APP_STATE_VERSION);
        }

        return {
            forms: load('edu_forms', DEFAULT_APP_STATE.forms),
            courses: load('edu_courses', DEFAULT_APP_STATE.courses),
            currentUser: load('edu_current_user', DEFAULT_APP_STATE.currentUser),
            darkMode: load('edu_dark_mode', DEFAULT_APP_STATE.darkMode),
            notifications: load('edu_notifications', DEFAULT_APP_STATE.notifications),
            users: load('edu_users', DEFAULT_APP_STATE.users),
        };
    } catch {
        return DEFAULT_APP_STATE;
    }
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const initialAppState = useMemo(() => getInitialAppState(), []);
    const [forms, setForms] = useState(() => initialAppState.forms);
    const [courses, setCourses] = useState(() => initialAppState.courses);

    const courseInstructors = useMemo(() => {
        const mapping = {};
        courses.forEach((course) => {
            if (!mapping[course.name]) {
                mapping[course.name] = [];
            }
            mapping[course.name].push(course.instructor);
        });
        return mapping;
    }, [courses]);

    const releasedCourses = useMemo(
        () => courses.filter((course) => course.released).map((course) => course.name),
        [courses]
    );

    const toggleCourseRelease = useCallback((courseName) => {
        setCourses((prev) => prev.map((course) => (
            course.name === courseName ? { ...course, released: !course.released } : course
        )));
    }, []);

    const [feedbacks, setFeedbacks] = useState([]);
    const [submissionCounts, setSubmissionCounts] = useState({ 'fb-fsad-ramu': 12, 'fb-cis-ganesh': 8 });
    const [submittedByStudent, setSubmittedByStudent] = useState({});

    const availableInstructors = useMemo(
        () => [...new Set(courses.map((course) => course.instructor))],
        [courses]
    );

    const availableCourses = useMemo(
        () => courses.map((course) => course.name),
        [courses]
    );

    const [currentUser, setCurrentUser] = useState(() => initialAppState.currentUser);
    const [darkMode, setDarkMode] = useState(() => initialAppState.darkMode);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        save('edu_dark_mode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = useCallback(() => {
        setDarkMode((prev) => !prev);
    }, []);

    useEffect(() => {
        try {
            localStorage.removeItem('edu_feedbacks');
            localStorage.removeItem('edu_submission_counts');
            localStorage.removeItem('edu_student_submitted');
        } catch {
            // Ignore storage cleanup failures.
        }
    }, []);

    const [notifications, setNotifications] = useState(() => initialAppState.notifications);
    const [users, setUsers] = useState(() => initialAppState.users);

    useEffect(() => { save('edu_forms', forms); }, [forms]);
    useEffect(() => { save('edu_courses', courses); }, [courses]);
    useEffect(() => { save('edu_current_user', currentUser); }, [currentUser]);
    useEffect(() => { save('edu_users', users); }, [users]);
    useEffect(() => { save('edu_notifications', notifications); }, [notifications]);

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
        setUsers((prev) => [...prev, newUser]);
        return newUser;
    }, []);

    const deleteUser = useCallback((userId) => {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
    }, []);

    const findUserByEmail = useCallback((email) => (
        users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    ), [users]);

    const validateUser = useCallback((identifier, password, role) => {
        const normalizedIdentifier = normalizeAuthValue(identifier);
        const normalizedPassword = String(password || '').trim();

        return users.find((user) => (
            user.role === role &&
            user.password === normalizedPassword &&
            getUserLoginIdentifiers(user).includes(normalizedIdentifier)
        ));
    }, [users]);

    const addNotification = useCallback((type, message, metadata = {}) => {
        const newNotification = {
            id: `notif-${Date.now()}`,
            type,
            message,
            metadata,
            timestamp: new Date().toISOString(),
            read: false,
        };
        setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const createForm = useCallback((formData) => {
        const newForm = {
            ...formData,
            id: `form-${Date.now()}`,
            createdAt: new Date().toISOString(),
            published: true,
        };
        setForms((prev) => [newForm, ...prev]);
        addNotification('new_campaign', `New feedback form published: "${newForm.title}"`, { formId: newForm.id });
        return newForm.id;
    }, [addNotification]);

    const deleteForm = useCallback((id) => {
        setForms((prev) => prev.filter((form) => form.id !== id));
        setSubmissionCounts((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const submitForm = useCallback((submissionKey, feedbackData) => {
        if (!submissionKey || !currentUser?.id) {
            return;
        }

        setSubmissionCounts((prev) => ({
            ...prev,
            [submissionKey]: (prev[submissionKey] || 0) + 1,
        }));

        if (feedbackData) {
            setFeedbacks((prev) => [
                {
                    id: `fb-${Date.now()}`,
                    ...feedbackData,
                    timestamp: new Date().toISOString(),
                },
                ...prev,
            ]);
        }

        setSubmittedByStudent((prev) => {
            const userKey = currentUser.id;
            const existing = Array.isArray(prev[userKey]) ? prev[userKey] : [];
            return {
                ...prev,
                [userKey]: [...new Set([...existing, submissionKey])],
            };
        });
    }, [currentUser]);

    const hasStudentSubmitted = useCallback((submissionKey) => {
        if (!currentUser?.id) {
            return false;
        }
        const submittedKeys = submittedByStudent[currentUser.id] || [];
        return submittedKeys.includes(submissionKey);
    }, [currentUser, submittedByStudent]);

    const totalForms = forms.length;
    const totalSubmissions = Object.values(submissionCounts).reduce((sum, count) => sum + count, 0);
    const publishedForms = forms.filter((form) => form.published);

    return (
        <AppContext.Provider
            value={{
                forms,
                publishedForms,
                courses,
                releasedCourses,
                toggleCourseRelease,
                availableCourses,
                availableInstructors,
                courseInstructors,
                feedbacks,
                submissionCounts,
                totalForms,
                totalSubmissions,
                createForm,
                deleteForm,
                submitForm,
                hasStudentSubmitted,
                darkMode,
                toggleDarkMode,
                currentUser,
                loginUser,
                logoutUser,
                users,
                registerUser,
                deleteUser,
                findUserByEmail,
                validateUser,
                notifications,
                markAllRead,
                clearNotifications,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used inside AppProvider');
    }
    return context;
};
