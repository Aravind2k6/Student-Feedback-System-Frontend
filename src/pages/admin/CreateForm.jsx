import { useState } from 'react';
import { PlusCircle, Trash2, Send, Eye, GripVertical, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/* ──────────────────────────────────────
   Available field types admin can add
   ────────────────────────────────────── */
const FIELD_TYPES = [
    { value: 'text', label: 'Short Text', icon: '✏️' },
    { value: 'textarea', label: 'Long Text', icon: '📝' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'select', label: 'Dropdown', icon: '🔽' },
    { value: 'radio', label: 'Multiple Choice', icon: '🔘' },
    { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
    { value: 'rating', label: '4-Point Rating', icon: '⭐' },
    { value: 'yesno', label: 'Yes / No', icon: '✅' },
    { value: 'date', label: 'Date Picker', icon: '📅' },
];

const TYPE_COLORS = {
    text: '#7c6cf5', textarea: '#a78bfa', email: '#60a5fa',
    number: '#34d399', select: '#f59e0b', radio: '#ec4899', checkbox: '#8b5cf6', rating: '#fbbf24', yesno: '#22d3a5', date: '#f87171',
};

const mkField = (type) => ({
    id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    label: '',
    required: false,
    placeholder: '',
    options: ['select', 'rating', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
});

/* ── Field row component ── */
const FieldRow = ({ field, index, onChange, onRemove }) => {
    const color = TYPE_COLORS[field.type] || '#7c6cf5';
    return (
        <div className="field-card animate-fade-in" style={{ animationDelay: `${index * 0.04}s` }}>
            <div className="field-drag-handle"><GripVertical size={16} /></div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color, background: `${color}20`, padding: '0.15rem 0.55rem', borderRadius: 5, letterSpacing: '0.04em' }}>
                        {FIELD_TYPES.find(t => t.value === field.type)?.icon} {FIELD_TYPES.find(t => t.value === field.type)?.label}
                    </span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: 'auto' }}>
                        <input type="checkbox" checked={field.required} onChange={e => onChange({ ...field, required: e.target.checked })}
                            style={{ accentColor: 'var(--accent-primary)', width: 13, height: 13 }} />
                        Required
                    </label>
                </div>

                <input
                    type="text" className="form-input"
                    style={{ fontSize: '0.88rem', marginBottom: '0.5rem' }}
                    placeholder={`Label for field ${index + 1}...`}
                    value={field.label}
                    onChange={e => onChange({ ...field, label: e.target.value })}
                />

                {/* Placeholder (for text types) */}
                {['text', 'email', 'number', 'textarea'].includes(field.type) && (
                    <input type="text" className="form-input" style={{ fontSize: '0.82rem' }}
                        placeholder="Placeholder text (optional)"
                        value={field.placeholder || ''}
                        onChange={e => onChange({ ...field, placeholder: e.target.value })}
                    />
                )}

                {/* Options (for select, radio, checkbox, and rating) */}
                {['select', 'rating', 'radio', 'checkbox'].includes(field.type) && (
                    <div style={{ marginTop: '0.5rem' }}>
                        {(field.options || []).map((opt, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                <input type="text" className="form-input" style={{ fontSize: '0.82rem', flex: 1 }}
                                    value={opt} placeholder={`Option ${i + 1}`}
                                    onChange={e => {
                                        const opts = [...(field.options || [])];
                                        opts[i] = e.target.value;
                                        onChange({ ...field, options: opts });
                                    }}
                                />
                                {(field.options || []).length > 1 && (
                                    <button type="button" className="btn-danger" style={{ padding: '0.35rem 0.5rem' }}
                                        onClick={() => { const opts = field.options.filter((_, j) => j !== i); onChange({ ...field, options: opts }); }}>
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="btn-ghost" style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
                            onClick={() => onChange({ ...field, options: [...(field.options || []), ''] })}>
                            + Add Option
                        </button>
                    </div>
                )}
            </div>

            <button type="button" className="btn-danger" style={{ padding: '0.4rem 0.5rem', alignSelf: 'flex-start', flexShrink: 0 }} onClick={onRemove}>
                <Trash2 size={15} />
            </button>
        </div>
    );
};

/* ── Templates ── */
const TEMPLATES = [
    {
        id: 'standard_course', label: 'Standard Course Evaluation',
        fields: [
            { ...mkField('rating'), label: '1. How well did the instructor explain the subject concepts?', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { ...mkField('rating'), label: '2. How clear were the lecture presentations?', required: true, options: ['Very Clear', 'Clear', 'Somewhat Clear', 'Not Clear'] },
            { ...mkField('rating'), label: '3. How useful were the study materials provided for the subject?', required: true, options: ['Very Useful', 'Useful', 'Slightly Useful', 'Not Useful'] },
            { ...mkField('rating'), label: '4. How effectively were doubts and questions addressed during the class?', required: true, options: ['Very Effectively', 'Effectively', 'Moderately', 'Not Effectively'] },
            { ...mkField('rating'), label: '5. Overall, how would you rate this subject?', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
        ]
    },
    {
        id: 'instructor', label: 'Instructor Performance',
        fields: [
            { ...mkField('rating'), label: '1. Punctuality and regularity of the instructor:', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { ...mkField('rating'), label: '2. Communication skills and articulation:', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { ...mkField('rating'), label: '3. Approachability and willingness to help:', required: true, options: ['Very Approachable', 'Approachable', 'Average', 'Not Approachable'] },
            { ...mkField('textarea'), label: '4. What are the instructor\'s strongest teaching attributes?', required: false },
        ]
    },
    {
        id: 'facilities', label: 'Infrastructure & Facilities',
        fields: [
            { ...mkField('rating'), label: '1. Quality of laboratory equipment and software:', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { ...mkField('rating'), label: '2. Speed and reliability of campus Wi-Fi:', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { ...mkField('rating'), label: '3. Library resources and reading space:', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { ...mkField('yesno'), label: '4. Do you face any issues with classrooms?', required: true },
            { ...mkField('textarea'), label: '5. Please specify any infrastructure issues you face:', required: false },
        ]
    },
    {
        id: 'blank', label: 'Blank Form',
        fields: []
    }
];

/* ── CreateForm page ── */
const CreateForm = () => {
    const navigate = useNavigate();
    const { createForm } = useApp();

    const [tab, setTab] = useState('editor'); // 'editor' | 'preview'
    const [success, setSuccess] = useState(false);

    const [meta, setMeta] = useState({
        title: '', description: '', courseCode: '', course: '', deadline: '',
    });
    
    const [templateId, setTemplateId] = useState('standard_course');
    const [fields, setFields] = useState(TEMPLATES[0].fields);

    const handleTemplateChange = (e) => {
        const id = e.target.value;
        setTemplateId(id);
        const template = TEMPLATES.find(t => t.id === id);
        if (template) {
            setFields(template.fields.map(f => ({ ...f, id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })));
        }
    };

    const addField = (type) => setFields(prev => [...prev, mkField(type)]);
    const removeField = (id) => setFields(prev => prev.filter(f => f.id !== id));
    const updateField = (id, next) => setFields(prev => prev.map(f => f.id === id ? next : f));

    const handlePublish = (e) => {
        e.preventDefault();
        if (!meta.title.trim()) return alert('Please enter a form title.');
        if (fields.length === 0) return alert('Please add at least one field.');
        createForm({ ...meta, fields });
        setSuccess(true);
        setTimeout(() => navigate('/admin'), 2200);
    };

    if (success) return (
        <div className="glass-panel success-screen animate-fade-in">
            <div className="success-icon-ring"><Save size={44} color="var(--success)" /></div>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>Form Published!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                "<strong style={{ color: 'var(--accent-secondary)' }}>{meta.title}</strong>" is now live for students.
            </p>
            <p style={{ color: 'var(--text-muted)', marginTop: '1.5rem', fontSize: '0.85rem' }}>Redirecting to dashboard…</p>
        </div>
    );

    return (
        <div style={{ padding: '2rem 2.5rem' }}>
            <h1 className="page-title animate-fade-in">Create Feedback Form</h1>
            <p className="page-subtitle animate-fade-in animate-delay-1">Build a Google-Form style survey your students can fill.</p>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.75rem', background: 'rgba(124,108,245,0.07)', border: '1px solid var(--glass-border)', padding: '0.25rem', borderRadius: 12, width: 'fit-content' }}>
                {['editor', 'preview'].map(t => (
                    <button key={t} type="button" onClick={() => setTab(t)} style={{
                        padding: '0.5rem 1.35rem', borderRadius: 9, fontSize: '0.88rem', fontWeight: 700,
                        background: tab === t ? 'var(--accent-gradient)' : 'transparent',
                        color: tab === t ? '#fff' : 'var(--text-secondary)',
                        border: 'none', cursor: 'pointer', textTransform: 'capitalize', transition: 'var(--transition)',
                        display: 'flex', alignItems: 'center', gap: '0.35rem'
                    }}>
                        {t === 'preview' && <Eye size={14} />}
                        {t === 'editor' ? '✏️ Editor' : '👁 Preview'}
                    </button>
                ))}
            </div>

            {tab === 'editor' ? (
                <form onSubmit={handlePublish}>
                    <div className="grid-2 animate-fade-in" style={{ gap: '1.5rem', alignItems: 'start' }}>

                        {/* ── Left: Form Meta ── */}
                        <div className="glass-panel">
                            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem', color: 'var(--accent-secondary)' }}>📋 Form Details</h3>

                            <div className="form-group">
                                <label className="form-label" style={{ color: 'var(--accent-primary)' }}>Feedback Format / Template</label>
                                <select className="form-input" value={templateId} onChange={handleTemplateChange} style={{ fontWeight: 700 }}>
                                    {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Form Title *</label>
                                <input type="text" className="form-input" placeholder="e.g. End of Semester Evaluation" required
                                    value={meta.title} onChange={e => setMeta({ ...meta, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" style={{ minHeight: 70 }} placeholder="Instructions for students…"
                                    value={meta.description} onChange={e => setMeta({ ...meta, description: e.target.value })} />
                            </div>
                            <div className="grid-2" style={{ gap: '0.85rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Course Code</label>
                                    <input type="text" className="form-input" placeholder="24SDC02E"
                                        value={meta.courseCode} onChange={e => setMeta({ ...meta, courseCode: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Course</label>
                                    <input type="text" className="form-input" placeholder="FSAD"
                                        value={meta.course} onChange={e => setMeta({ ...meta, course: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Submission Deadline</label>
                                <input type="date" className="form-input" value={meta.deadline} onChange={e => setMeta({ ...meta, deadline: e.target.value })} />
                            </div>

                            {/* Add Field Palette */}
                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Field</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                    {FIELD_TYPES.map(ft => (
                                        <button key={ft.value} type="button" onClick={() => addField(ft.value)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                                padding: '0.35rem 0.75rem', borderRadius: 7,
                                                background: `${TYPE_COLORS[ft.value]}18`,
                                                border: `1px solid ${TYPE_COLORS[ft.value]}40`,
                                                color: TYPE_COLORS[ft.value], fontSize: '0.78rem', fontWeight: 700,
                                                cursor: 'pointer', transition: 'var(--transition)',
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.background = `${TYPE_COLORS[ft.value]}30`; }}
                                            onMouseOut={e => { e.currentTarget.style.background = `${TYPE_COLORS[ft.value]}18`; }}
                                        >
                                            {ft.icon} {ft.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Fields ── */}
                        <div className="glass-panel">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-secondary)' }}>
                                    🗂 Form Fields ({fields.length})
                                </h3>
                                {fields.length > 0 && (
                                    <span className="badge badge-info">{fields.filter(f => f.required).length} required</span>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '62vh', overflowY: 'auto', paddingRight: '0.2rem' }}>
                                {fields.map((field, i) => (
                                    <FieldRow key={field.id} field={field} index={i}
                                        onChange={(next) => updateField(field.id, next)}
                                        onRemove={() => removeField(field.id)}
                                    />
                                ))}
                                {fields.length === 0 && (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">📋</div>
                                        <h3>No fields yet</h3>
                                        <p>Use the "+ Add Field" palette on the left to add fields.</p>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem' }}>
                                <button type="button" className="btn-ghost" onClick={() => navigate('/admin')}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={fields.length === 0} style={{ opacity: fields.length === 0 ? 0.4 : 1 }}>
                                    <Send size={16} /> Publish Form
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                /* ── Preview Tab ── */
                <div className="glass-panel animate-fade-in" style={{ maxWidth: 660, margin: '0 auto' }}>
                    <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                        {meta.courseCode && <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{meta.courseCode}</div>}
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{meta.title || 'Form Title'}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{meta.description || 'No description.'}</p>
                        {meta.deadline && <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--warning)' }}>Deadline: {meta.deadline}</div>}
                    </div>

                    {fields.map((f, i) => (
                        <div key={f.id} style={{ marginBottom: '1.75rem' }}>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem', fontSize: '0.92rem' }}>
                                {i + 1}. {f.label || 'Untitled field'}
                                {f.required && <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>}
                            </label>
                            {(f.type === 'text' || f.type === 'email' || f.type === 'number') && (
                                <div className="form-input" style={{ color: 'var(--text-muted)', cursor: 'not-allowed' }}>{f.placeholder || 'Short answer…'}</div>
                            )}
                            {f.type === 'textarea' && (
                                <div className="form-input" style={{ minHeight: 70, color: 'var(--text-muted)', cursor: 'not-allowed' }}>{f.placeholder || 'Long answer…'}</div>
                            )}
                            {f.type === 'date' && (
                                <div className="form-input" style={{ color: 'var(--text-muted)', cursor: 'not-allowed' }}>mm / dd / yyyy</div>
                            )}
                            {f.type === 'select' && (
                                <div className="form-input" style={{ color: 'var(--text-muted)', cursor: 'not-allowed' }}>Select an option ▾</div>
                            )}
                            {f.type === 'radio' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
                                    {(f.options || []).map(opt => (
                                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'not-allowed' }}>
                                            <input type="radio" disabled style={{ accentColor: 'var(--accent-primary)', width: 15, height: 15 }} /> {opt}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {f.type === 'checkbox' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
                                    {(f.options || []).map(opt => (
                                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'not-allowed' }}>
                                            <input type="checkbox" disabled style={{ accentColor: 'var(--accent-primary)', width: 16, height: 16, borderRadius: 3 }} /> {opt}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {f.type === 'rating' && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {[1, 2, 3, 4].map(s => (
                                        <div key={s} style={{
                                            width: 32, height: 32, borderRadius: 8, border: '1px solid var(--glass-border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)'
                                        }}>
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {f.type === 'yesno' && (
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {['Yes', 'No'].map(opt => (
                                        <div key={opt} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'not-allowed' }}>{opt}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {fields.length === 0 && <div className="empty-state"><div className="empty-state-icon">📋</div><h3>No fields to preview</h3><p>Switch to Editor and add some fields.</p></div>}
                </div>
            )}
        </div>
    );
};

export default CreateForm;
