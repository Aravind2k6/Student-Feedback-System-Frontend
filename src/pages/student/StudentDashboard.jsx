import { useState, useMemo, useEffect } from 'react';
import { ClipboardList, CheckCircle, AlertCircle, Send, Award, Clock, Bell, Trash2, X, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RatingWidget = ({ value, onChange, options }) => {
    // If custom options are provided (length 4), use them, otherwise fallback to default labels
    const labels = (options && options.length === 4)
        ? ['', ...options]
        : ['', 'Poor', 'Average', 'Good', 'Excellent'];

    return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map(n => (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <button type="button"
                        onClick={() => onChange(n)}
                        style={{
                            width: 44, height: 44, borderRadius: 10, fontSize: '1.1rem', fontWeight: 800,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'var(--transition)', cursor: 'pointer',
                            border: `2px solid ${value === n ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                            background: value === n ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                            color: value === n ? '#fff' : 'var(--text-secondary)',
                            boxShadow: value === n ? '0 8px 20px rgba(249,115,22,0.3)' : 'none',
                        }}
                    >
                        {n}
                    </button>
                    <span style={{
                        fontSize: '0.65rem',
                        fontWeight: value === n ? 800 : 600,
                        color: value === n ? 'var(--accent-secondary)' : 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {labels[n]}
                    </span>
                </div>
            ))}
        </div>
    );
};

const StudentDashboard = () => {
    const {
        publishedForms, submitForm, currentUser, hasStudentSubmitted,
        courses, releasedCourses, courseInstructors, availableInstructors, availableCourses,
        feedbacks,
        notifications, markAllRead, clearNotifications,
        darkMode, toggleDarkMode
    } = useApp();
    const student = (currentUser && currentUser.name) ? currentUser : { name: 'Student', id: 'STU-DEMO', dept: 'Computer Science', semester: '6th Semester' };

    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [feedbackTab, setFeedbackTab] = useState('active'); // 'active' | 'expired'
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [rating, setRating] = useState(0);
    const [dynamicRatings, setDynamicRatings] = useState({});
    const [remarks, setRemarks] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);

    const resetForm = () => {
        setSelectedCampaign(null);
        setSelectedCourse('');
        setSelectedInstructor('');
        setRating(0);
        setDynamicRatings({});
        setRemarks('');
        setError('');
        setSubmitted(false);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isCourseReleased = (form) => {
        if (form.type !== 'Course') return true;
        const targetCourse = form.course || 
                            courses.find(c => c.name === form.target || c.courseName === form.target)?.name;
        if (!targetCourse) return true;
        return releasedCourses.includes(targetCourse);
    };

    const activeForms = useMemo(() =>
        publishedForms.filter(f => isCourseReleased(f) && (!f.deadline || new Date(f.deadline) >= today)),
        [publishedForms, releasedCourses, courses]
    );

    // Alert logic for deadlines within next 48 hours
    const approachingDeadlines = useMemo(() => {
        return activeForms.filter(f => {
            if (!f.deadline) return false;
            const d = new Date(f.deadline);
            const diff = d.getTime() - today.getTime();
            const days = diff / (1000 * 60 * 60 * 24);
            return days >= 0 && days <= 2;
        });
    }, [activeForms]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const expiredForms = useMemo(() =>
        publishedForms.filter(f => isCourseReleased(f) && (f.deadline && new Date(f.deadline) < today)),
        [publishedForms, releasedCourses, courses]
    );
    const currentForms = feedbackTab === 'active' ? activeForms : expiredForms;

    const submissionKey = useMemo(() => {
        if (!selectedCampaign || !selectedCourse || !selectedInstructor) return null;
        return `fb-${selectedCampaign.id}-${selectedCourse}-${selectedInstructor}`.toLowerCase().replace(/\s+/g, '-');
    }, [selectedCampaign, selectedCourse, selectedInstructor]);

    const isAlreadySubmitted = useMemo(() => {
        return submissionKey ? hasStudentSubmitted(submissionKey) : false;
    }, [submissionKey, hasStudentSubmitted]);

    const isCourseLocked = useMemo(() => {
        if (!selectedCampaign) return false;
        const targetCourse = selectedCampaign.course || 
                             courses.find(c => c.name === selectedCampaign.target || c.courseName === selectedCampaign.target)?.name;
        return !!targetCourse && releasedCourses.includes(targetCourse);
    }, [selectedCampaign, courses, releasedCourses]);

    const instructors = useMemo(() => {
        if (!selectedCourse) return [];
        return courseInstructors[selectedCourse] || [];
    }, [selectedCourse, courseInstructors]);

    // Auto-select course if specified in campaign
    useEffect(() => {
        if (selectedCampaign) {
            const targetCourse = selectedCampaign.course || 
                                 courses.find(c => c.name === selectedCampaign.target || c.courseName === selectedCampaign.target)?.name;
            
            if (targetCourse && releasedCourses.includes(targetCourse)) {
                setSelectedCourse(targetCourse);
            }
        }
    }, [selectedCampaign, courses, releasedCourses]);

    // Auto-select instructor if only one is available
    useEffect(() => {
        if (selectedCourse && instructors.length === 1) {
            setSelectedInstructor(instructors[0]);
        }
    }, [selectedCourse, instructors]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCourse || !selectedInstructor) {
            setError('Please select Course and Instructor.');
            return;
        }

        const dynamicFields = selectedCampaign.fields || [];
        const missingRating = dynamicFields.some(f => {
            if (!f.required) return false;
            const val = dynamicRatings[f.id];
            if (f.type === 'rating') return !val || val === 0;
            return !val || val === '';
        });

        if (missingRating || (dynamicFields.length === 0 && rating === 0)) {
            setError('Please provide all required ratings.');
            return;
        }

        // Find overall rating field to map to primary rating
        const overallField = dynamicFields.find(f => f.label.toLowerCase().includes('overall'));
        const overallRating = overallField ? dynamicRatings[overallField.id] : (rating || 0);

        // Submit using the unique key and pass data for Admin to see
        submitForm(submissionKey, {
            formId: selectedCampaign.id,
            course: selectedCourse,
            instructor: selectedInstructor,
            rating: overallRating,
            dynamicRatings,
            remarks
        });

        setSubmitted(true);
        setError('');

        // Reset after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setSelectedCourse('');
            setSelectedInstructor('');
            setRating(0);
            setDynamicRatings({});
            setRemarks('');
        }, 3000);
    };

    const getAverage = (feedbackArray) => {
        const validFeedbacks = feedbackArray.filter(f => f.rating && !isNaN(Number(f.rating)));
        if (validFeedbacks.length === 0) return '0';
        return (validFeedbacks.reduce((acc, curr) => acc + Number(curr.rating), 0) / validFeedbacks.length).toFixed(1);
    };

    const getStatsBy = (key, value) => {
        const filtered = feedbacks.filter(f => f[key] === value);
        return { avg: getAverage(filtered), count: filtered.length };
    };

    return (
        <div className="content-wrapper animate-fade-in">
            {/* Header */}
            <div className="dashboard-header" style={{ position: 'relative', zIndex: 50 }}>
                <div>
                    <h1 className="page-title animate-fade-in">Student Dashboard</h1>
                    <p className="page-subtitle animate-fade-in animate-delay-1" style={{ marginBottom: 0 }}>
                        Welcome back, <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>{student.name}</span>!
                    </p>
                </div>

                <div className="dashboard-toolbar animate-fade-in animate-delay-2">
                    <div className="dashboard-toolbar-controls" style={{ position: 'relative' }}>
                        <button
                            className="dashboard-icon-btn"
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                if (!showNotifications) markAllRead();
                            }}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: -5, right: -5,
                                    background: 'var(--error)', color: '#fff',
                                    fontSize: '0.6rem', fontWeight: 800,
                                    padding: '0.1rem 0.35rem', borderRadius: 99,
                                    border: '2px solid var(--bg-primary)'
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <button
                            className="dashboard-icon-btn"
                            onClick={toggleDarkMode}
                            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications Tray */}
                        {showNotifications && (
                            <div className="glass-panel animate-scale-in" style={{
                                position: 'absolute', top: '100%', right: 0, marginTop: '0.75rem',
                                width: '360px', zIndex: 1000, padding: 0, overflow: 'hidden',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)'
                            }}>
                                <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Notifications</h3>
                                    <button className="btn-ghost" style={{ padding: '0.2rem', color: 'var(--text-muted)' }} onClick={() => setShowNotifications(false)}>
                                        <X size={16} />
                                    </button>
                                </div>
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            No notifications.
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} style={{
                                                padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                background: n.read ? 'transparent' : 'rgba(79,70,229,0.05)',
                                                display: 'flex', flexDirection: 'column', gap: '0.25rem'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                                                        {n.type === 'new_campaign' ? '📢 New Feedback' : '🔔 Alert'}
                                                    </span>
                                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                                        <button
                                            className="btn-ghost"
                                            style={{ fontSize: '0.75rem', color: 'var(--error)', padding: '0.2rem 0.5rem' }}
                                            onClick={clearNotifications}
                                        >
                                            <Trash2 size={13} style={{ marginRight: '0.3rem' }} /> Clear History
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="dashboard-status-chip">
                        <Award size={14} /> {student.semester}
                    </div>
                </div>
            </div>

            {/* Approaching Deadline Alert */}
            {approachingDeadlines.length > 0 && (
                <div className="alert alert-warning animate-fade-in animate-delay-2" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--warning)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AlertCircle size={24} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.1rem' }}>Approaching Deadlines!</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            The following forms are closing soon:
                            {approachingDeadlines.map((f, i) => (
                                <strong key={f.id} style={{ color: 'var(--accent-primary)' }}>
                                    {i > 0 ? ', ' : ' '}{f.title} ({new Date(f.deadline).toLocaleDateString()})
                                </strong>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="animate-fade-in animate-delay-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Feedback Selection Widget */}
                <div className="glass-panel">
                    {!selectedCampaign ? (
                        <div>
                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'rgba(79,70,229,0.07)', border: '1px solid var(--glass-border)', padding: '0.25rem', borderRadius: 12, width: 'fit-content' }}>
                                {[
                                    { key: 'active', label: '✅ Active Feedbacks', count: activeForms.length },
                                    { key: 'expired', label: '⏰ Expired Feedbacks', count: expiredForms.length },
                                    { key: 'results', label: '📊 Results', count: feedbacks.length }
                                ].map(t => (
                                    <button key={t.key} type="button" onClick={() => setFeedbackTab(t.key)} style={{
                                        padding: '0.45rem 1.1rem', borderRadius: 9, fontSize: '0.85rem', fontWeight: 700,
                                        background: feedbackTab === t.key ? (t.key === 'results' ? 'var(--accent-gradient)' : t.key === 'expired' ? 'linear-gradient(135deg,#ef4444,#f87171)' : 'var(--accent-gradient)') : 'transparent',
                                        color: feedbackTab === t.key ? '#fff' : 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer', transition: 'var(--transition)',
                                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                                    }}>
                                        {t.label}
                                        <span style={{ background: feedbackTab === t.key ? 'rgba(255,255,255,0.25)' : 'var(--glass-border)', borderRadius: 99, padding: '0 0.45rem', fontSize: '0.75rem', fontWeight: 800 }}>{t.count}</span>
                                    </button>
                                ))}
                            </div>

                            {feedbackTab === 'results' ? (
                                <div className="animate-fade-in">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Total Samples</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{feedbacks.length}</div>
                                        </div>
                                        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Overall Avg</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{getAverage(feedbacks)} / 4</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <section>
                                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: 4, height: 16, background: 'var(--accent-primary)', borderRadius: 2 }}></div>
                                                Ratings by Course
                                            </h3>
                                            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {availableCourses.map(c => {
                                                    const { avg, count } = getStatsBy('course', c);
                                                    const pct = (parseFloat(avg) / 4) * 100;
                                                    return (
                                                        <div key={c}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                                                                <span style={{ fontWeight: 600 }}>{c} <span style={{ opacity: 0.5, fontWeight: 400 }}>({count})</span></span>
                                                                <span style={{ color: 'var(--accent-secondary)', fontWeight: 800 }}>{avg}</span>
                                                            </div>
                                                            <div className="progress-bar-bg" style={{ height: 6 }}>
                                                                <div className="progress-bar-fill" style={{
                                                                    width: `${pct}%`,
                                                                    height: '100%',
                                                                    background: parseFloat(avg) >= 3 ? 'var(--success)' : parseFloat(avg) >= 2 ? 'var(--warning)' : 'var(--error)'
                                                                }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: 4, height: 16, background: 'var(--accent-secondary)', borderRadius: 2 }}></div>
                                                Instructor Performance
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                                {availableInstructors.map(ins => {
                                                    const { avg, count } = getStatsBy('instructor', ins);
                                                    return (
                                                        <div key={ins} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div>
                                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ins}</div>
                                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{count} feedbacks</div>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: parseFloat(avg) >= 3 ? 'var(--success)' : 'var(--warning)' }}>{avg}</div>
                                                                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {feedbackTab === 'expired' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.65rem 1rem', background: 'rgba(239,68,68,0.06)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.18)' }}>
                                            <Clock size={15} style={{ color: '#ef4444', flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>These feedback forms have passed their deadline and are closed for submissions.</span>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        {currentForms.length === 0 ? (
                                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 12 }}>
                                                {feedbackTab === 'active' ? 'No active feedbacks at the moment.' : 'No expired feedbacks.'}
                                            </div>
                                        ) : (
                                            currentForms.map(form => (
                                                <button
                                                    key={form.id}
                                                    onClick={() => feedbackTab === 'active' ? setSelectedCampaign(form) : null}
                                                    className="card animate-scale-in"
                                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '1.25rem', cursor: feedbackTab === 'expired' ? 'not-allowed' : 'pointer', opacity: feedbackTab === 'expired' ? 0.7 : 1 }}
                                                >
                                                    <div style={{ textAlign: 'left' }}>
                                                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{form.title}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Launched {new Date(form.createdAt).toLocaleDateString()}</div>
                                                        {form.deadline && (
                                                            <div style={{ fontSize: '0.72rem', marginTop: '0.25rem', color: feedbackTab === 'expired' ? '#ef4444' : 'var(--warning)', fontWeight: 600 }}>
                                                                {feedbackTab === 'expired' ? '⏰ Closed' : '📅 Deadline'}:  {new Date(form.deadline).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ color: feedbackTab === 'expired' ? '#ef4444' : 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                                        {feedbackTab === 'expired' ? 'Closed ✕' : 'Fill Feedback ➜'}
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <ClipboardList size={22} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedCampaign.title}</h2>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Providing feedback for this requirement.</p>
                                    </div>
                                </div>
                                <button onClick={resetForm} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                                    Switch Feedback
                                </button>
                            </div>

                            {submitted ? (
                                <div className="animate-scale-in" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,211,165,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#22d3a5' }}>
                                        <CheckCircle size={36} />
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Feedback Submitted!</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>Thank you for helping us improve our quality.</p>
                                    <button onClick={resetForm} className="btn-primary" style={{ marginTop: '1.5rem', marginInline: 'auto' }}>
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                                    <div className="grid-2" style={{ gap: '1.1rem' }}>
                                        <div>
                                            <label className="form-label">Select Course</label>
                                            {isCourseLocked ? (
                                                <div className="form-input" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--accent-secondary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <CheckCircle size={16} /> {selectedCourse}
                                                </div>
                                            ) : (
                                                <select className="form-input" value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); setSelectedInstructor(''); }}>
                                                    <option value="">Choose Course…</option>
                                                    {releasedCourses.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">Select Instructor</label>
                                            <select className="form-input" value={selectedInstructor} onChange={e => setSelectedInstructor(e.target.value)}>
                                                <option value="">Choose Instructor…</option>
                                                {instructors.map(ins => <option key={ins} value={ins}>{ins}</option>)}
                                            </select>
                                        </div>

                                    </div>

                                    {isAlreadySubmitted ? (
                                        <div className="glass-panel" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)', padding: '1.5rem', textAlign: 'center' }}>
                                            <div style={{ color: 'var(--error)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                                <AlertCircle size={32} />
                                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Feedback Already Submitted</div>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                                                    You have already provided feedback for <strong>{selectedCourse}</strong> with <strong>{selectedInstructor}</strong> in this campaign.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {selectedCampaign.fields && selectedCampaign.fields.length > 0 ? (
                                                selectedCampaign.fields.map(field => {
                                                    // Skip "Full Name", "Student ID", "Email", "Department" as they come from profile
                                                    const profileFields = ['full name', 'student id', 'email', 'email address', 'department', 'course', 'course code', 'instructor name'];
                                                    if (profileFields.includes(field.label.toLowerCase())) return null;

                                                    return (
                                                        <div key={field.id} style={{ marginBottom: '1.5rem' }}>
                                                            <label className="form-label" style={{ marginBottom: '0.65rem', display: 'block' }}>
                                                                {field.label} {field.required && <span style={{ color: 'var(--error)' }}>*</span>}
                                                            </label>

                                                            {field.type === 'rating' && (
                                                                <RatingWidget
                                                                    value={dynamicRatings[field.id] || 0}
                                                                    onChange={(val) => setDynamicRatings(prev => ({ ...prev, [field.id]: val }))}
                                                                    options={field.options}
                                                                />
                                                            )}

                                                            {(field.type === 'text' || field.type === 'email') && (
                                                                <input
                                                                    type={field.type}
                                                                    className="form-input"
                                                                    placeholder={field.placeholder}
                                                                    value={dynamicRatings[field.id] || ''}
                                                                    onChange={(e) => setDynamicRatings(prev => ({ ...prev, [field.id]: e.target.value }))}
                                                                />
                                                            )}

                                                            {field.type === 'textarea' && (
                                                                <textarea
                                                                    className="form-input"
                                                                    style={{ minHeight: 80 }}
                                                                    placeholder={field.placeholder}
                                                                    value={dynamicRatings[field.id] || ''}
                                                                    onChange={(e) => setDynamicRatings(prev => ({ ...prev, [field.id]: e.target.value }))}
                                                                />
                                                            )}

                                                            {field.type === 'yesno' && (
                                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                                    {['Yes', 'No'].map(opt => (
                                                                        <button
                                                                            key={opt}
                                                                            type="button"
                                                                            className={`btn-ghost ${dynamicRatings[field.id] === opt ? 'active' : ''}`}
                                                                            style={{
                                                                                padding: '0.5rem 1.5rem',
                                                                                borderRadius: 10,
                                                                                background: dynamicRatings[field.id] === opt ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                                                                                color: dynamicRatings[field.id] === opt ? '#fff' : 'var(--text-secondary)',
                                                                                borderColor: dynamicRatings[field.id] === opt ? 'var(--accent-primary)' : 'var(--glass-border)',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() => setDynamicRatings(prev => ({ ...prev, [field.id]: opt }))}
                                                                        >
                                                                            {opt}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {field.type === 'select' && (
                                                                <select
                                                                    className="form-input"
                                                                    value={dynamicRatings[field.id] || ''}
                                                                    onChange={(e) => setDynamicRatings(prev => ({ ...prev, [field.id]: e.target.value }))}
                                                                >
                                                                    <option value="">Select an option...</option>
                                                                    {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                                </select>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div>
                                                    <label className="form-label" style={{ marginBottom: '0.85rem' }}>Your Rating</label>
                                                    <RatingWidget value={rating} onChange={setRating} />
                                                </div>
                                            )}

                                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                                <label className="form-label" style={{ marginBottom: '0.85rem' }}>Additional Remarks (Optional)</label>
                                                <textarea
                                                    className="form-input"
                                                    style={{ minHeight: 100 }}
                                                    placeholder="Share any additional thoughts or suggestions..."
                                                    value={remarks}
                                                    onChange={(e) => setRemarks(e.target.value)}
                                                />
                                            </div>

                                            {error && (
                                                <div style={{ color: 'var(--error)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <AlertCircle size={14} /> {error}
                                                </div>
                                            )}

                                            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.8rem 2.2rem', gap: '0.6rem' }}>
                                                <Send size={18} /> Submit Feedback
                                            </button>
                                        </>
                                    )}
                                </form>
                            )}
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default StudentDashboard;
