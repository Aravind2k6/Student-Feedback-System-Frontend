import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { forms, feedbacks, currentUser, courses, darkMode, toggleDarkMode } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    const adminName = currentUser?.name || 'Admin';

    // Stat calculations
    const totalForms = forms.length;
    const activeForms = forms.filter(f => {
        if (!f.deadline) return f.published;
        return f.published && new Date(f.deadline) >= new Date();
    }).length;
    const totalResponses = feedbacks.length;

    const getAvgRating = () => {
        const valid = feedbacks.filter(f => f.rating && !isNaN(Number(f.rating)));
        if (valid.length === 0) return 0;
        return (valid.reduce((a, b) => a + Number(b.rating), 0) / valid.length).toFixed(1);
    };
    const avgRating = getAvgRating();

    const statCards = [
        {
            label: 'Total Forms',
            value: totalForms,
            sub: '+3 vs last month',
            subColor: '#22c55e',
            icon: '📋',
            iconBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
            topBorder: '#3b82f6',
        },
        {
            label: 'Active Forms',
            value: activeForms,
            sub: `+${activeForms} currently live`,
            subColor: '#22c55e',
            icon: '✅',
            iconBg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            topBorder: '#22c55e',
        },
        {
            label: 'Total Responses',
            value: totalResponses,
            sub: '+12% response rate',
            subColor: '#f59e0b',
            icon: '💬',
            iconBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            topBorder: '#f59e0b',
        },
        {
            label: 'Avg. Rating / 5',
            value: avgRating,
            sub: '▲ High satisfaction',
            subColor: '#a855f7',
            icon: '⭐',
            iconBg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
            topBorder: '#a855f7',
        },
    ];

    // Recent forms
    const recentForms = forms.slice(0, 6);

    // ── Courses Overview: derived from context ──────────────────────────────
    const coursesList = courses.slice(0, 5);


    const getFormType = (form) => form.type || (() => {
        const t = (form.title || '').toLowerCase();
        if (t.includes('institution') || t.includes('service')) return 'Institution';
        return 'Course';
    })();

    const getFormStatus = (form) => {
        if (!form.published) return 'Draft';
        if (form.deadline && new Date(form.deadline) < new Date()) return 'Expired';
        return 'Active';
    };

    const getResponseCount = (form) => feedbacks.filter(f => f.formId === form.id).length;

    return (
        <div className="admin-ov-root animate-fade-in">
            <div className="admin-ov-topbar">
                <div className="admin-ov-topbar-left">
                    <div className="admin-ov-breadcrumb">Overview</div>
                    <div className="admin-ov-tagline">Welcome back, {adminName}</div>
                </div>
                <div className="admin-ov-topbar-right">
                    <div className="admin-ov-search-wrap">
                        <Search size={15} className="admin-ov-search-icon" />
                        <input
                            className="admin-ov-search"
                            type="text"
                            placeholder="Search forms, courses..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="admin-ov-icon-btn"><Bell size={18} /></button>
                    <button className="admin-ov-icon-btn" onClick={toggleDarkMode}>
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>

            {/* Welcome heading */}
            <div className="admin-ov-welcome">
                <h1 className="admin-ov-welcome-title">Welcome back, {adminName}! 👋</h1>
                <p className="admin-ov-welcome-sub">Here's what's happening with your feedback system today.</p>
            </div>

            {/* Stat Cards */}
            <div className="admin-ov-stats-row">
                {statCards.map((s, i) => (
                    <div key={i} className="admin-ov-stat-card" style={{ borderTop: `3px solid ${s.topBorder}` }}>
                        <div className="admin-ov-stat-icon" style={{ background: s.iconBg }}>
                            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
                        </div>
                        <div className="admin-ov-stat-body">
                            <div className="admin-ov-stat-value">{s.value}</div>
                            <div className="admin-ov-stat-label">{s.label}</div>
                            <div className="admin-ov-stat-sub" style={{ color: s.subColor }}>
                                ↑ {s.sub}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two-column: Recent Forms + Courses Overview */}
            <div className="admin-ov-grid">

                {/* ── Recent Forms ─────────────────────────────── */}
                <div className="admin-ov-panel">
                    <div className="admin-ov-panel-header">
                        <div>
                            <div className="admin-ov-panel-title">Recent Forms</div>
                            <div className="admin-ov-panel-sub">Latest feedback forms created</div>
                        </div>
                        <button className="admin-ov-view-all-btn" onClick={() => navigate('/admin/forms')}>
                            View All
                        </button>
                    </div>

                    <div className="admin-ov-forms-list">
                        {recentForms.length === 0 && (
                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0', fontSize: '0.9rem' }}>
                                No forms yet. Create one to get started.
                            </div>
                        )}
                        {recentForms.map(form => {
                            const type = getFormType(form);
                            const status = getFormStatus(form);
                            const count = getResponseCount(form);
                            return (
                                <div key={form.id} className="admin-ov-form-row">
                                    <div className="admin-ov-form-info">
                                        <div className="admin-ov-form-title">{form.title}</div>
                                        <div className="admin-ov-form-meta">
                                            <span className={`admin-ov-tag ${type === 'Institution' ? 'tag-institution' : 'tag-course'}`}>
                                                {type}
                                            </span>
                                            <span className="admin-ov-resp-count">{count} responses</span>
                                        </div>
                                    </div>
                                    <span className={`admin-ov-status-badge ${status === 'Active' ? 'status-active' :
                                        status === 'Expired' ? 'status-expired' : 'status-draft'
                                        }`}>
                                        • {status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Courses Overview ──────────────────────────── */}
                <div className="admin-ov-panel">
                    <div className="admin-ov-panel-header">
                        <div className="admin-ov-panel-title">🎓 Courses Overview</div>
                        <button className="admin-ov-view-all-text" onClick={() => navigate('/admin/courses')}>
                            View All
                        </button>
                    </div>

                    <div className="admin-ov-courses-list">
                        {coursesList.map((course, i) => (
                            <div key={i} className="admin-ov-course-row">
                                <div>
                                    <div className="admin-ov-course-name">{course.name}</div>
                                    <div className="admin-ov-course-code">{course.code}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
