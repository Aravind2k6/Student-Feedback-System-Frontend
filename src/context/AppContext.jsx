import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL, apiFetch, readErrorMessage } from '../api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [forms, setForms] = useState([]);
    const [publishedForms, setPublishedForms] = useState([]);
    const [submittedFormIds, setSubmittedFormIds] = useState([]);
    const [courses, setCourses] = useState([]);
    const [currentUser, setCurrentUser] = useState(() => {
        const stored = localStorage.getItem('edu_current_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('edu_dark_mode');
        return stored ? JSON.parse(stored) === true : false;
    });
    const [notifications, setNotifications] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [submissionCounts, setSubmissionCounts] = useState({});
    const [stats, setStats] = useState({ totalForms: 0, totalSubmissions: 0, totalUsers: 0 });

    const fetchInitialData = useCallback(async () => {
        try {
            const [coursesRes, formsRes, publishedRes, statsRes] = await Promise.all([
                apiFetch('/courses'),
                apiFetch('/forms'),
                apiFetch('/forms/published'),
                apiFetch('/admin/stats')
            ]);

            if (coursesRes.ok) setCourses(await coursesRes.json());
            if (formsRes.ok) setForms(await formsRes.json());
            if (publishedRes.ok) setPublishedForms(await publishedRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (err) {
            console.error('Failed to fetch initial data:', err);
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!currentUser?.id) return;
        try {
            const res = await apiFetch(`/notifications?userId=${currentUser.id}`);
            if (res.ok) setNotifications(await res.json());
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    }, [currentUser]);

    const fetchStudentSubmissions = useCallback(async () => {
        if (!currentUser?.id || currentUser?.role !== 'student') {
            setSubmittedFormIds([]);
            return;
        }

        try {
            const res = await apiFetch(`/submissions/student/${currentUser.id}`);
            if (res.ok) {
                const submissions = await res.json();
                setSubmittedFormIds([
                    ...new Set(
                        submissions
                            .map((submission) => submission.formId)
                            .filter(Boolean)
                    )
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch student submissions:', err);
        }
    }, [currentUser]);

    const fetchFeedbacks = useCallback(async () => {
        const role = currentUser?.role?.toLowerCase();
        if (!currentUser?.id || role !== 'admin') {
            console.log('fetchFeedbacks: User is not admin, clearing feedbacks.');
            setFeedbacks([]);
            return;
        }

        console.log('fetchFeedbacks: Fetching all submissions for admin...');

        try {
            const url = `${API_BASE_URL}/submissions`;
            console.log(`fetchFeedbacks: Calling URL -> ${url}`);
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                console.log(`fetchFeedbacks: Successfully fetched ${data.length} submissions.`);
                setFeedbacks(data);
            } else {
                console.error('fetchFeedbacks: Failed to fetch submissions. Status:', res.status);
            }
        } catch (err) {
            console.error('Failed to fetch feedbacks:', err);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        const role = currentUser?.role?.toLowerCase();
        if (role === 'admin') {
            fetchFeedbacks();
        } else if (role === 'student') {
            fetchStudentSubmissions();
        }
    }, [currentUser, fetchFeedbacks, fetchStudentSubmissions]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('edu_dark_mode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = useCallback(() => {
        setDarkMode((prev) => !prev);
    }, []);

    const loginUser = useCallback(async (credentials) => {
        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            if (res.ok) {
                const user = await res.json();
                setCurrentUser(user);
                localStorage.setItem('edu_current_user', JSON.stringify(user));
                // Immediately refresh data for the logged in user
                fetchInitialData();
                return user;
            }
            throw new Error(await readErrorMessage(res, 'Login failed'));
        } catch (err) {
            throw err;
        }
    }, [fetchInitialData]);

    const logoutUser = useCallback(() => {
        setCurrentUser(null);
        setSubmittedFormIds([]);
        localStorage.removeItem('edu_current_user');
    }, []);

    const registerUser = useCallback(async (userData) => {
        try {
            const res = await apiFetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (res.ok) return await res.json();
            throw new Error(await readErrorMessage(res, 'Registration failed'));
        } catch (err) {
            throw err;
        }
    }, []);

    const forgotPassword = useCallback(async (email) => {
        try {
            const res = await apiFetch('/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) return await res.json();
            throw new Error(await readErrorMessage(res, 'Failed to request reset link'));
        } catch (err) {
            throw err;
        }
    }, []);

    const resetPassword = useCallback(async (token, newPassword) => {
        try {
            const res = await apiFetch('/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });
            if (res.ok) return await res.json();
            throw new Error(await readErrorMessage(res, 'Failed to reset password'));
        } catch (err) {
            throw err;
        }
    }, []);

    const toggleCourseRelease = useCallback(async (courseName) => {
        try {
            const res = await apiFetch(`/courses/${courseName}/release`, {
                method: 'PATCH'
            });
            if (res.ok) {
                const updated = await res.json();
                setCourses(prev => prev.map(c => c.name === courseName ? updated : c));
            }
        } catch (err) {
            console.error('Failed to toggle release:', err);
        }
    }, []);

    const createForm = useCallback(async (formData) => {
        const normalizedCourse = (formData.course || '').trim();
        const normalizedTarget = (formData.target || normalizedCourse || 'All Students').trim();
        const payload = {
            title: (formData.title || '').trim(),
            description: formData.description || '',
            deadline: formData.deadline,
            published: formData.published ?? true,
            type: formData.type || (normalizedCourse ? 'Course' : 'Institution'),
            target: normalizedTarget,
            course: normalizedCourse || null,
            fields: (formData.fields || []).map((field) => ({
                id: field.id,
                label: field.label,
                type: field.type,
                required: field.required ?? false,
                options: Array.isArray(field.options)
                    ? field.options.map((option) => option.trim()).filter(Boolean)
                    : field.options
            }))
        };

        try {
            const res = await apiFetch('/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error(await readErrorMessage(res, 'Failed to create form'));
            }

            const newForm = await res.json();
            setForms(prev => [newForm, ...prev]);
            if (newForm.published) {
                setPublishedForms(prev => [newForm, ...prev]);
            }
            fetchInitialData();
            return newForm;
        } catch (err) {
            console.error('Failed to create form:', err);
            throw err;
        }
    }, [fetchInitialData]);

    const deleteForm = useCallback(async (id) => {
        try {
            console.log(`deleteForm: Attempting to delete form ID: ${id}`);
            const res = await apiFetch(`/forms/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setForms(prev => prev.filter(f => f.id !== id));
                setPublishedForms(prev => prev.filter(f => f.id !== id));
                alert('Form deleted successfully.');
                fetchInitialData();
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error('deleteForm: Failed to delete form. Status:', res.status, errorData);
                alert(`Failed to delete form. (Status: ${res.status})`);
            }
        } catch (err) {
            console.error('Failed to delete form:', err);
            alert('An error occurred while trying to delete the form.');
        }
    }, [fetchInitialData]);

    const resetAllData = useCallback(async () => {
        try {
            console.warn('AppContext: Requesting SYSTEM RESET...');
            const res = await apiFetch('/forms/reset-all', {
                method: 'DELETE'
            });
            if (res.ok) {
                setForms([]);
                setPublishedForms([]);
                setFeedbacks([]);
                alert('System Reset Successful! All forms and submissions have been cleared.');
                fetchInitialData();
            } else {
                alert('Failed to reset system. Status: ' + res.status);
            }
        } catch (err) {
            console.error('Failed to reset data:', err);
            alert('An error occurred during system reset.');
        }
    }, [fetchInitialData]);

    const submitForm = useCallback(async (submissionKey, feedbackData) => {
        if (!currentUser?.id) return;
        try {
            const payload = {
                submissionKey,
                formId: feedbackData.formId,
                studentId: currentUser.id,
                course: feedbackData.course,
                instructor: feedbackData.instructor,
                rating: feedbackData.rating,
                dynamicRatings: feedbackData.dynamicRatings,
                remarks: feedbackData.remarks
            };
            console.log('submitForm: Payload being sent:', payload);
            const res = await apiFetch('/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log('submitForm: Server responded with status:', res.status);

            if (res.ok) {
                const data = await res.json();
                console.log('submitForm: Success! Data:', data);
                if (feedbackData.formId) {
                    setSubmittedFormIds((prev) =>
                        prev.includes(feedbackData.formId) ? prev : [...prev, feedbackData.formId]
                    );
                }
                fetchInitialData(); // Update submission counts
                if (currentUser?.role === 'admin') {
                    fetchFeedbacks();
                }
                return { success: true };
            } else {
                const errData = await res.json().catch(() => ({}));
                console.error('submitForm: Request failed with error:', errData);
                return { 
                    success: false, 
                    error: errData.message || errData.error || `Server error (Status: ${res.status})`
                };
            }
        } catch (err) {
            console.error('submitForm: Unexpected error:', err);
            return { success: false, error: err.message || 'Network error' };
        }
    }, [currentUser, fetchInitialData, fetchFeedbacks]);

    const hasStudentSubmitted = useCallback(async (submissionKey) => {
        try {
            const res = await apiFetch(`/submissions/check?key=${submissionKey}`);
            if (res.ok) {
                const data = await res.json();
                return data.submitted;
            }
        } catch (err) {
            console.error('Failed to check submission:', err);
        }
        return false;
    }, []);

    const markAllRead = useCallback(async () => {
        if (!currentUser?.id) return;
        try {
            await apiFetch(`/notifications/read-all?userId=${currentUser.id}`, {
                method: 'PATCH'
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark all read:', err);
        }
    }, [currentUser]);

    const clearNotifications = useCallback(async () => {
        if (!currentUser?.id) return;
        try {
            await apiFetch(`/notifications?userId=${currentUser.id}`, {
                method: 'DELETE'
            });
            setNotifications([]);
        } catch (err) {
            console.error('Failed to clear notifications:', err);
        }
    }, [currentUser]);

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

    const availableInstructors = useMemo(
        () => [...new Set(courses.map((course) => course.instructor))],
        [courses]
    );

    const availableCourses = useMemo(
        () => courses.map((course) => course.name),
        [courses]
    );

    return (
        <AppContext.Provider
            value={{
                forms,
                publishedForms,
                submittedFormIds,
                courses,
                releasedCourses,
                toggleCourseRelease,
                availableCourses,
                availableInstructors,
                courseInstructors,
                feedbacks, // Use state instead of hardcoded empty array
                submissionCounts,
                totalForms: stats.totalForms,
                totalSubmissions: stats.totalSubmissions,
                publishedFormsCount: stats.publishedForms,
                createForm,
                deleteForm,
                resetAllData,
                submitForm,
                hasStudentSubmitted,
                darkMode,
                toggleDarkMode,
                currentUser,
                loginUser,
                logoutUser,
                notifications,
                markAllRead,
                clearNotifications,
                registerUser,
                forgotPassword,
                resetPassword,
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
