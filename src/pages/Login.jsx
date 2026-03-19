import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight, Lock, BookOpen, Eye, EyeOff, X, Mail, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ── Forgot Password Modal ─────────────────────────────── */
const ForgotModal = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 3000, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', padding: '1.5rem',
        }} onClick={onClose}>
            <div className="animate-fade-in" style={{
                width: '100%', maxWidth: 420, background: 'rgba(248, 250, 252, 0.98)',
                border: '1px solid rgba(79, 70, 229, 0.20)', borderRadius: 24,
                padding: '2.5rem 2.25rem', boxShadow: '0 20px 60px rgba(15,23,42,0.14)', position: 'relative',
            }} onClick={e => e.stopPropagation()}>
                <button type="button" onClick={onClose} style={{
                    position: 'absolute', top: '1.1rem', right: '1.1rem',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
                }}><X size={20} /></button>

                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14, background: 'rgba(79,70,229,0.12)',
                        border: '1px solid rgba(79,70,229,0.24)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)',
                    }}><Mail size={22} /></div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.3rem' }}>Forgot Password?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem' }}>
                        Enter your email and we'll send a reset link.
                    </p>
                </div>

                {sent ? (
                    <div style={{
                        padding: '1rem', borderRadius: 12, textAlign: 'center',
                        background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)',
                        color: 'var(--success)', fontSize: '0.9rem', lineHeight: 1.6,
                    }}>
                        ✓ Reset link sent! Check your inbox.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>EMAIL ADDRESS</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="email" className="auth-input" placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                            Send Reset Link <ArrowRight size={16} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

/* ── Create Account Modal ──────────────────────────────── */
const CreateAccountModal = ({ onClose, initialRole = 'student' }) => {
    const { registerUser, findUserByEmail } = useApp();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: initialRole });
    const [done, setDone] = useState(false);
    const [err, setErr] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) { setErr('Passwords do not match.'); return; }
        const normalizedEmail = form.email.trim().toLowerCase();
        if (findUserByEmail(normalizedEmail)) { setErr('An account with this email already exists.'); return; }

        const usernameBase = form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
        const username = usernameBase || normalizedEmail.split('@')[0] || `user${Date.now()}`;
        const createdUser = registerUser({
            id: form.role === 'admin' ? `admin-${Date.now()}` : `student-${Date.now()}`,
            name: form.name.trim(),
            username,
            email: normalizedEmail,
            password: form.password,
            role: form.role,
            dept: form.role === 'student' ? 'Computer Science' : undefined,
            semester: form.role === 'student' ? '6th Semester' : undefined,
        });
        void createdUser;
        setDone(true);
        setErr('');
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 3000, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', padding: '1.5rem',
        }} onClick={onClose}>
            <div className="animate-fade-in" style={{
                width: '100%', maxWidth: 440, background: 'rgba(248, 250, 252, 0.98)',
                border: '1px solid rgba(79, 70, 229, 0.20)', borderRadius: 24,
                padding: '2.5rem 2.25rem', boxShadow: '0 20px 60px rgba(15,23,42,0.14)', position: 'relative',
                maxHeight: '90vh', overflowY: 'auto',
            }} onClick={e => e.stopPropagation()}>
                <button type="button" onClick={onClose} style={{
                    position: 'absolute', top: '1.1rem', right: '1.1rem',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
                }}><X size={20} /></button>

                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14, background: 'rgba(79,70,229,0.12)',
                        border: '1px solid rgba(79,70,229,0.24)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)',
                    }}><UserPlus size={22} /></div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.3rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem' }}>Create your account, then sign in with that email or username.</p>
                </div>

                {done ? (
                    <div style={{
                        padding: '1rem', borderRadius: 12, textAlign: 'center',
                        background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)',
                        color: 'var(--success)', fontSize: '0.9rem', lineHeight: 1.6,
                    }}>
                        ✓ Account created! You can now sign in.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {err && <div className="alert alert-error animate-fade">{err}</div>}

                        {/* Role picker */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginBottom: '1.25rem', background: 'rgba(79, 70, 229, 0.06)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '0.35rem' }}>
                            {[{ r: 'student', label: 'Student', Icon: User }, { r: 'admin', label: 'Admin', Icon: ShieldCheck }].map(({ r, label, Icon }) => (
                                <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                                        padding: '0.65rem', borderRadius: 9, fontWeight: 700, fontSize: '0.88rem',
                                        border: 'none', cursor: 'pointer', transition: 'var(--transition)',
                                        background: form.role === r ? 'var(--accent-gradient)' : 'transparent',
                                        color: form.role === r ? '#fff' : 'var(--text-secondary)',
                                        boxShadow: form.role === r ? '0 4px 14px rgba(79,70,229,0.28)' : 'none',
                                    }}>
                                    <Icon size={16} /> {label}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>FULL NAME</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="text" className="auth-input" placeholder="Your name"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                            </div>
                        </div>

                        <div>
                            <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>EMAIL ADDRESS</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="email" className="auth-input" placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                            </div>
                        </div>

                        <div>
                            <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="password" className="auth-input" placeholder="Create a password"
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                            </div>
                        </div>

                        <div>
                            <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>CONFIRM PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="password" className="auth-input" placeholder="Repeat your password"
                                    value={form.confirm}
                                    onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.15rem' }}>
                            Create Account <ArrowRight size={16} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

/* ── Main Login Page ───────────────────────────────────── */
const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'student';
    const [role, setRole] = useState(initialRole);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const { loginUser, validateUser } = useApp();

    useEffect(() => {
        setRole(searchParams.get('role') === 'admin' ? 'admin' : 'student');
    }, [searchParams]);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            const authenticatedUser = validateUser(identifier, password, role);

            if (authenticatedUser) {
                loginUser(authenticatedUser);
                navigate(role === 'student' ? '/student' : '/admin');
            } else {
                setError(`Invalid ${role === 'admin' ? 'admin' : 'student'} credentials. Please try again.`);
            }
        }, 650);
    };

    return (
        <div className="auth-shell">
            <div className="site-background" aria-hidden="true">
                <div className="bg-orb bg-orb-primary" />
                <div className="bg-orb bg-orb-secondary" />
                <div className="bg-orb bg-orb-tertiary" />
                <div className="bg-beam bg-beam-left" />
                <div className="bg-beam bg-beam-right" />
                <div className="mesh-grid" />
                <div className="bg-noise" />
                <div className="bg-vignette" />
            </div>

            {/* Back to home */}
            <a href="/" style={{ position: 'absolute', top: '1.5rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent-secondary)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <BookOpen size={15} /> EduFeedback
            </a>

            <div className="animate-fade-in" style={{ maxWidth: '420px', width: '100%' }}>
                <div style={{
                    background: 'rgba(248,250,252,0.98)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(79,70,229,0.20)', borderRadius: 24,
                    padding: '2.5rem 2.25rem', boxShadow: '0 20px 60px rgba(15,23,42,0.14)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Top glow line */}
                    <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)' }} />

                    {/* Icon + heading */}
                    <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 25px rgba(79,70,229,0.24)' }}>
                            <BookOpen size={28} color="#fff" strokeWidth={2.5} />
                        </div>
                        <h1 style={{ 
                            fontSize: '2.4rem', 
                            fontWeight: 800, 
                            marginBottom: '0.4rem', 
                            letterSpacing: '-0.035em',
                            color: 'var(--text-primary)',
                            lineHeight: 1
                        }}>Welcome Back</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500 }}>Sign in to your EduFeedback account</p>
                    </div>

                    {/* Role toggle */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginBottom: '1.75rem', background: 'rgba(79,70,229,0.07)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '0.28rem' }}>
                        {[
                            { r: 'student', label: 'Student', Icon: User },
                            { r: 'admin', label: 'Admin', Icon: ShieldCheck },
                        ].map(({ r, label, Icon }) => (
                            <button key={r} type="button" onClick={() => { setRole(r); setError(''); }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', padding: '0.65rem', borderRadius: 9,
                                    fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer', transition: 'var(--transition)',
                                    background: role === r ? 'var(--accent-gradient)' : 'transparent',
                                    color: role === r ? '#fff' : 'var(--text-secondary)',
                                    boxShadow: role === r ? '0 4px 14px rgba(79,70,229,0.28)' : 'none',
                                }}>
                                <Icon size={16} /> {label}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="alert alert-error animate-fade" style={{ marginBottom: '1.25rem' }}>{error}</div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {/* Username */}
                        <div>
                            <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                                {role === 'admin' ? 'USERNAME OR EMAIL' : 'USERNAME OR EMAIL'}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder={role === 'student' ? 'Enter your username or email' : 'Enter your admin username or email'}
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', margin: 0 }}>PASSWORD</label>
                                <button type="button" onClick={() => setShowForgot(true)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600, padding: 0 }}>
                                    Forgot password?
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type={showPass ? 'text' : 'password'} className="auth-input"
                                    placeholder="Enter your password"
                                    value={password} onChange={e => setPassword(e.target.value)} required />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn-primary" disabled={loading}
                            style={{ width: '100%', padding: '0.9rem', marginTop: '0.25rem', opacity: loading ? 0.7 : 1 }}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="17" height="17" viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
                                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="50" strokeDashoffset="20" strokeLinecap="round" />
                                    </svg>
                                    Signing in…
                                </span>
                            ) : (<>Sign in as {role === 'student' ? 'Student' : 'Admin'} <ArrowRight size={16} /></>)}
                        </button>
                    </form>

                    {/* Create account link */}
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.87rem', color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <button type="button" onClick={() => setShowCreate(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.87rem', padding: 0 }}>
                            Create account
                        </button>
                    </p>
                </div>
            </div>

            {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}
            {showCreate && <CreateAccountModal initialRole={role} onClose={() => setShowCreate(false)} />}
        </div>
    );
};

export default Login;
