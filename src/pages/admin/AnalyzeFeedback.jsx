import { Users, TrendingUp, ClipboardList, ShieldCheck, BarChart3, Download, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';

const TEXT_RESPONSE_TYPES = new Set(['text', 'textarea']);
const REMARK_LABEL_PATTERN = /remark|comment|suggestion|feedback|issue|attribute|thought|improv/i;

const getSubmissionDate = (feedback) => {
    const rawTimestamp = feedback?.submittedAt ?? feedback?.createdAt ?? feedback?.updatedAt ?? feedback?.timestamp;
    if (!rawTimestamp) return null;

    const parsedDate = new Date(rawTimestamp);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getDynamicRemarkEntries = (feedback, formFieldsById) => {
    if (!feedback?.dynamicRatings || typeof feedback.dynamicRatings !== 'object') {
        return [];
    }

    const formFields = formFieldsById.get(feedback.formId) || [];
    const fieldLookup = new Map(formFields.map((field) => [field.id || field.fieldId, field]));
    const textResponses = Object.entries(feedback.dynamicRatings).flatMap(([fieldId, value]) => {
        const field = fieldLookup.get(fieldId);
        const fieldType = (field?.type || field?.fieldType || '').toLowerCase().trim();

        if (!TEXT_RESPONSE_TYPES.has(fieldType)) {
            return [];
        }

        const normalizedValue = Array.isArray(value)
            ? value.join(', ').trim()
            : String(value ?? '').trim();

        if (!normalizedValue) {
            return [];
        }

        return [{
            label: String(field?.label || '').trim(),
            value: normalizedValue
        }];
    });

    const prioritizedResponses = textResponses.filter((entry) => REMARK_LABEL_PATTERN.test(entry.label));
    return prioritizedResponses.length > 0 ? prioritizedResponses : textResponses;
};

const getDisplayRemarks = (feedback, formFieldsById) => {
    const directRemark = typeof feedback?.remarks === 'string' ? feedback.remarks.trim() : '';
    const dynamicRemarks = getDynamicRemarkEntries(feedback, formFieldsById).map(({ label, value }) => (
        label ? `${label}: ${value}` : value
    ));

    return [...new Set([directRemark, ...dynamicRemarks].filter(Boolean))].join(' | ');
};

const AnalyzeFeedback = () => {
    const { feedbacks: allFeedbacks, availableCourses, availableInstructors, forms } = useApp();
    const location = useLocation();
    const [filterCourse, setFilterCourse] = useState(null);

    useEffect(() => {
        if (location.state?.filterCourse) {
            setFilterCourse(location.state.filterCourse);
        }
    }, [location.state]);

    const feedbacks = filterCourse
        ? allFeedbacks.filter((feedback) => feedback.course === filterCourse)
        : allFeedbacks;

    const getAverage = (feedbackArray) => {
        const validFeedbacks = feedbackArray.filter((feedback) => feedback.rating && !Number.isNaN(Number(feedback.rating)));
        if (validFeedbacks.length === 0) return '0';
        return (
            validFeedbacks.reduce((total, feedback) => total + Number(feedback.rating), 0) / validFeedbacks.length
        ).toFixed(1);
    };

    const getStatsBy = (key, value) => {
        const filtered = feedbacks.filter((feedback) => feedback[key] === value);
        return { avg: getAverage(filtered), count: filtered.length };
    };

    const formFieldsById = useMemo(() => {
        const lookup = new Map();
        forms.forEach((form) => {
            lookup.set(form.id, Array.isArray(form.fields) ? form.fields : []);
        });
        return lookup;
    }, [forms]);

    const normalizedFeedbacks = useMemo(() => (
        feedbacks
            .map((feedback, index) => {
                const submissionDate = getSubmissionDate(feedback);
                return {
                    ...feedback,
                    derivedRemarks: getDisplayRemarks(feedback, formFieldsById),
                    stableKey: feedback.id ?? `${feedback.formId ?? 'submission'}-${index}`,
                    submissionDate,
                    submissionTimeLabel: submissionDate ? submissionDate.toLocaleString() : 'Date unavailable'
                };
            })
            .sort((left, right) => {
                const leftTime = left.submissionDate ? left.submissionDate.getTime() : 0;
                const rightTime = right.submissionDate ? right.submissionDate.getTime() : 0;
                return rightTime - leftTime;
            })
    ), [feedbacks, formFieldsById]);

    const recentFeedbacks = normalizedFeedbacks.slice(0, 5);
    const feedbacksWithRemarks = normalizedFeedbacks.filter((feedback) => feedback.derivedRemarks).slice(0, 8);

    const downloadCSV = () => {
        if (feedbacks.length === 0) {
            alert('No feedback data available to export.');
            return;
        }

        const headers = ['id', 'course', 'instructor', 'rating', 'remarks', 'submittedAt'];
        const dynamicKeys = new Set();

        feedbacks.forEach((feedback) => {
            if (feedback.dynamicRatings) {
                Object.keys(feedback.dynamicRatings).forEach((key) => dynamicKeys.add(key));
            }
        });

        const allHeaders = [...headers, ...Array.from(dynamicKeys)];
        const csvRows = [
            allHeaders.join(','),
            ...feedbacks.map((feedback) => allHeaders.map((header) => {
                let value = '';
                if (header in feedback) {
                    value = feedback[header];
                } else if (feedback.dynamicRatings && header in feedback.dynamicRatings) {
                    value = feedback.dynamicRatings[header];
                }

                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `feedback_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const topCourse = useMemo(() => {
        if (feedbacks.length === 0) return '-';
        const courseAvgs = availableCourses.map((course) => ({ name: course, ...getStatsBy('course', course) }));
        const sorted = courseAvgs.sort((left, right) => parseFloat(right.avg) - parseFloat(left.avg));
        return sorted[0]?.avg !== '0' ? sorted[0]?.name ?? '-' : '-';
    }, [feedbacks, availableCourses]);

    const topInstructor = useMemo(() => {
        if (feedbacks.length === 0) return '-';
        const instructorAvgs = availableInstructors.map((instructor) => ({ name: instructor, ...getStatsBy('instructor', instructor) }));
        const sorted = instructorAvgs.sort((left, right) => parseFloat(right.avg) - parseFloat(left.avg));
        return sorted[0]?.avg !== '0' ? sorted[0]?.name ?? '-' : '-';
    }, [feedbacks, availableInstructors]);

    const stats = [
        { label: 'Total Feedbacks', value: feedbacks.length, icon: <Users size={22} />, color: '#22d3a5', bg: 'rgba(34,211,165,0.15)' },
        { label: 'Avg Rating', value: feedbacks.length > 0 ? getAverage(feedbacks) : '-', icon: <TrendingUp size={22} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
        { label: 'Top Course', value: topCourse, icon: <ClipboardList size={22} />, color: '#7c6cf5', bg: 'rgba(124,108,245,0.15)' },
        { label: 'Top Instructor', value: topInstructor, icon: <ShieldCheck size={22} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
    ];

    return (
        <div style={{ padding: '2rem 2.5rem' }}>
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title animate-fade-in">Feedback Analytics</h1>
                    <p className="page-subtitle animate-fade-in animate-delay-1" style={{ marginBottom: 0 }}>
                        In-depth analysis of student ratings and descriptive remarks across courses and instructors.
                    </p>
                </div>
                <button
                    onClick={downloadCSV}
                    className="btn-primary animate-fade-in animate-delay-2"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                    <Download size={16} /> Download CSV
                </button>
            </div>

            {filterCourse && (
                <div
                    className="filter-badge animate-fade-in"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        background: 'rgba(124, 108, 245, 0.1)',
                        border: '1px solid rgba(124, 108, 245, 0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        width: 'fit-content',
                        marginBottom: '1.5rem',
                        color: 'var(--accent-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 600
                    }}
                >
                    <span>Filtering by: {filterCourse}</span>
                    <button
                        onClick={() => setFilterCourse(null)}
                        style={{
                            background: 'rgba(124, 108, 245, 0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--accent-primary)'
                        }}
                    >
                        <X size={12} strokeWidth={3} />
                    </button>
                </div>
            )}

            <div className="grid-auto animate-fade-in" style={{ marginBottom: '2.5rem' }}>
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="glass-panel"
                        style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', padding: '1.35rem', animationDelay: `${index * 0.08}s` }}
                    >
                        <div className="stat-icon" style={{ background: stat.bg }}>
                            <span style={{ color: stat.color }}>{stat.icon}</span>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.15rem' }}>{stat.label}</div>
                            <div
                                style={{
                                    fontSize: stat.value.toString().length > 10 ? '0.9rem' : '1.75rem',
                                    fontWeight: 800,
                                    color: stat.color,
                                    lineHeight: 1.1
                                }}
                            >
                                {stat.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid-2 animate-fade-in animate-delay-1" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="glass-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <BarChart3 size={18} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Ratings by Course</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {availableCourses.map((course) => {
                            const { avg, count } = getStatsBy('course', course);
                            const percentage = (parseFloat(avg) / 4) * 100;

                            return (
                                <div key={course}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>
                                            {course} <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>({count} samples)</span>
                                        </span>
                                        <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>{avg} / 4</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${percentage}%`,
                                                background: parseFloat(avg) >= 3 ? 'var(--success)' : parseFloat(avg) >= 2 ? 'var(--warning)' : 'var(--error)'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="glass-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <TrendingUp size={18} color="var(--success)" />
                        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Instructor Performance</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {availableInstructors.map((instructor, index) => {
                            const { avg, count } = getStatsBy('instructor', instructor);
                            return (
                                <div
                                    key={instructor}
                                    className="card"
                                    style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
                                >
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{instructor}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{count} feedbacks</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: parseFloat(avg) >= 3 ? '#22d3a5' : '#fbbf24' }}>{avg}</div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Rating</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="glass-panel animate-fade-in animate-delay-2" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Recent Feedback Submissions</h3>
                {recentFeedbacks.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No feedback submissions yet.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentFeedbacks.map((feedback) => (
                            <div
                                key={feedback.stableKey}
                                style={{
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: 12,
                                    border: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                                        {feedback.course} - {feedback.instructor}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                        {feedback.submissionTimeLabel}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: 800, color: 'var(--accent-secondary)' }}>{feedback.rating}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 4</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="glass-panel animate-fade-in animate-delay-3">
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Student Remarks & Suggestions</h3>
                {feedbacksWithRemarks.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No written remarks submitted yet.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {feedbacksWithRemarks.map((feedback) => (
                            <div
                                key={feedback.stableKey}
                                style={{
                                    padding: '1.25rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: 16,
                                    border: '1px solid var(--glass-border)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.75rem' }}>
                                    <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                                        {feedback.course} - {feedback.instructor}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>{feedback.submissionTimeLabel}</span>
                                </div>
                                <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: -5,
                                            fontSize: '1.5rem',
                                            color: 'var(--accent-secondary)',
                                            opacity: 0.4
                                        }}
                                    >
                                        "
                                    </span>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                        {feedback.derivedRemarks}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyzeFeedback;
