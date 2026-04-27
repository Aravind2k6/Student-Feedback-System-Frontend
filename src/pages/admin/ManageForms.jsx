import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Sun, Plus, LayoutGrid, TableProperties, Pause, BarChart2, Copy, Trash2, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDeadlineDate, isDeadlineExpired } from '../../utils/date';

const TYPE_COLORS = {
    Course: { bg: 'rgba(79,70,229,0.12)', color: '#4338ca', label: 'Course' },
    Instructor: { bg: 'rgba(16,185,129,0.12)', color: '#059669', label: 'Instructor' },
    Institution: { bg: 'rgba(245,158,11,0.14)', color: '#d97706', label: 'Institution' },
};

const ManageForms = () => {
    const navigate = useNavigate();
    const { forms, deleteForm, resetAllData, feedbacks, darkMode, toggleDarkMode } = useApp();

    const [filter, setFilter] = useState('All');      // All | Active | Closed
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [viewMode, setViewMode] = useState('table'); // table | cards
    const [searchQuery, setSearchQuery] = useState('');
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);

    const getStatus = (form) => {
        if (!form.published) return 'Draft';
        if (isDeadlineExpired(form.deadline)) return 'Closed';
        return 'Active';
    };

    const isOverdue = (deadline) => isDeadlineExpired(deadline);

    const getResponseCount = (form) => feedbacks.filter(f => f.formId === form.id).length;

    const getFormType = (form) => form.type || 'Course';
    const getFormTarget = (form) => form.target || '—';
    const getQsCount = (form) => (form.fields || []).length;

    const formatDate = (d) => {
        if (!d) return '—';
        return formatDeadlineDate(d);
    };

    const formatCreated = (iso) => {
        if (!iso) return '';
        return 'Created ' + iso.slice(0, 10);
    };

    // Compute counts
    const activeCount = forms.filter(f => getStatus(f) === 'Active').length;

    // Filter
    const filtered = forms.filter(form => {
        const status = getStatus(form);
        if (filter === 'Active' && status !== 'Active') return false;
        if (filter === 'Closed' && status !== 'Closed' && status !== 'Draft') return false;
        if (typeFilter !== 'All Types' && getFormType(form) !== typeFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!form.title?.toLowerCase().includes(q) && !getFormTarget(form)?.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const handleDelete = (id) => {
        if (window.confirm('Delete this form? This action cannot be undone.')) {
            deleteForm(id);
        }
    };

    return (
        <div className="mf-root">
            {/* Top Bar */}
            <div className="admin-ov-topbar">
                <div className="admin-ov-topbar-left">
                    <div className="admin-ov-breadcrumb">Manage Forms</div>
                    <div className="admin-ov-tagline">View and control all feedback forms</div>
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

            {/* Content */}
            <div className="mf-content">
                {/* Header row */}
                <div className="mf-header-row">
                    <div>
                        <h1 className="mf-title">Feedback Forms</h1>
                        <p className="mf-subtitle">{forms.length} total · {activeCount} active</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            className="btn-ghost"
                            onClick={() => {
                                if (window.confirm('WARNING: This will delete ALL forms and ALL submissions forever! Are you sure?')) {
                                    if (window.confirm('FINAL CONFIRMATION: Are you absolutely sure you want to clear everything?')) {
                                        resetAllData();
                                    }
                                }
                            }}
                            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.6rem 1.25rem', fontSize: '0.88rem', fontWeight: 700 }}
                        >
                            <Trash2 size={16} /> Clear All Data
                        </button>
                        <button className="mf-create-btn" onClick={() => navigate('/admin/create')}>
                            <Plus size={16} /> Create Form
                        </button>
                    </div>
                </div>

                {/* Filter & View Row */}
                <div className="mf-filter-row">
                    <div className="mf-filter-left">
                        {/* Status tabs */}
                        <div className="mf-tabs">
                            {['All', 'Active', 'Closed'].map(tab => (
                                <button
                                    key={tab}
                                    className={`mf-tab${filter === tab ? ' mf-tab-active' : ''}`}
                                    onClick={() => setFilter(tab)}
                                >{tab}</button>
                            ))}
                        </div>

                        {/* Type dropdown */}
                        <div className="mf-dropdown-wrap">
                            <button
                                className="mf-type-dropdown"
                                onClick={() => setShowTypeDropdown(v => !v)}
                            >
                                {typeFilter} <ChevronDown size={14} />
                            </button>
                            {showTypeDropdown && (
                                <div className="mf-dropdown-menu">
                                    {['All Types', 'Course', 'Instructor', 'Institution'].map(t => (
                                        <button
                                            key={t}
                                            className="mf-dropdown-item"
                                            onClick={() => { setTypeFilter(t); setShowTypeDropdown(false); }}
                                        >{t}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* View toggle */}
                    <div className="mf-view-toggle">
                        <button
                            className={`mf-view-btn${viewMode === 'table' ? ' mf-view-btn-active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <TableProperties size={15} /> Table
                        </button>
                        <button
                            className={`mf-view-btn${viewMode === 'cards' ? ' mf-view-btn-active' : ''}`}
                            onClick={() => setViewMode('cards')}
                        >
                            <LayoutGrid size={15} /> Cards
                        </button>
                    </div>
                </div>

                {/* TABLE VIEW */}
                {viewMode === 'table' && (
                    <div className="mf-table-wrap">
                        <table className="mf-table">
                            <thead>
                                <tr>
                                    <th>FORM TITLE</th>
                                    <th>TYPE</th>
                                    <th>TARGET</th>
                                    <th style={{ textAlign: 'center' }}>QS</th>
                                    <th>RESPONSES</th>
                                    <th>DEADLINE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '2.5rem', fontSize: '0.9rem' }}>
                                            No forms found.
                                        </td>
                                    </tr>
                                )}
                                {filtered.map(form => {
                                    const type = getFormType(form);
                                    const typeStyle = TYPE_COLORS[type] || TYPE_COLORS.Course;
                                    const status = getStatus(form);
                                    const deadline = formatDate(form.deadline);
                                    const overdueDeadline = isOverdue(form.deadline);
                                    const qs = getQsCount(form);
                                    const responses = getResponseCount(form);
                                    return (
                                        <tr key={form.id} className="mf-tr">
                                            <td>
                                                <div className="mf-form-title">{form.title}</div>
                                                <div className="mf-form-created">{formatCreated(form.createdAt)}</div>
                                            </td>
                                            <td>
                                                <span className="mf-type-badge" style={{ background: typeStyle.bg, color: typeStyle.color }}>
                                                    {typeStyle.label}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="mf-target">{getFormTarget(form)}</span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="mf-qs">{qs}</span>
                                            </td>
                                            <td>
                                                <span className="mf-responses">{responses} responses</span>
                                            </td>
                                            <td>
                                                <span className={overdueDeadline ? 'mf-deadline mf-deadline-overdue' : 'mf-deadline'}>
                                                    {deadline}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={`mf-status-pill mf-status-${status.toLowerCase()}`}>
                                                    <span className="mf-status-dot"></span>
                                                    {status}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="mf-actions">
                                                    <button className="mf-action-btn mf-action-pause" title="Pause">
                                                        <Pause size={13} />
                                                    </button>
                                                    <button className="mf-action-btn mf-action-chart" title="Analytics" onClick={() => navigate('/admin/analysis')}>
                                                        <BarChart2 size={13} />
                                                    </button>
                                                    <button className="mf-action-btn mf-action-copy" title="Duplicate">
                                                        <Copy size={13} />
                                                    </button>
                                                    <button className="mf-action-btn mf-action-delete" title="Delete" onClick={() => handleDelete(form.id)}>
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* CARDS VIEW */}
                {viewMode === 'cards' && (
                    <div className="mf-cards-grid">
                        {filtered.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '2.5rem', fontSize: '0.9rem' }}>
                                No forms found.
                            </div>
                        )}
                        {filtered.map(form => {
                            const type = getFormType(form);
                            const typeStyle = TYPE_COLORS[type] || TYPE_COLORS.Course;
                            const status = getStatus(form);
                            const deadline = formatDate(form.deadline);
                            const overdueDeadline = isOverdue(form.deadline);
                            const qs = getQsCount(form);
                            const responses = getResponseCount(form);
                            return (
                                <div key={form.id} className="mf-card">
                                    <div className="mf-card-top">
                                        <span className="mf-type-badge" style={{ background: typeStyle.bg, color: typeStyle.color }}>
                                            {typeStyle.label}
                                        </span>
                                        <div className={`mf-status-pill mf-status-${status.toLowerCase()}`}>
                                            <span className="mf-status-dot"></span>
                                            {status}
                                        </div>
                                    </div>
                                    <div className="mf-form-title" style={{ marginTop: '0.6rem', fontSize: '0.92rem' }}>{form.title}</div>
                                    <div className="mf-form-created">{formatCreated(form.createdAt)}</div>
                                    <div className="mf-card-meta">
                                        <span><strong>{qs}</strong> questions</span>
                                        <span><strong>{responses}</strong> responses</span>
                                        <span className={overdueDeadline ? 'mf-deadline-overdue' : ''}>Due: {deadline}</span>
                                    </div>
                                    <div className="mf-card-target">{getFormTarget(form)}</div>
                                    <div className="mf-card-actions">
                                        <button className="mf-action-btn mf-action-pause" title="Pause"><Pause size={13} /></button>
                                        <button className="mf-action-btn mf-action-chart" title="Analytics" onClick={() => navigate('/admin/analysis')}><BarChart2 size={13} /></button>
                                        <button className="mf-action-btn mf-action-copy" title="Duplicate"><Copy size={13} /></button>
                                        <button className="mf-action-btn mf-action-delete" title="Delete" onClick={() => handleDelete(form.id)}><Trash2 size={13} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageForms;
