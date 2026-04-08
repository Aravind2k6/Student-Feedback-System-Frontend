import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { resetPassword } = useApp();
    
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Missing or invalid reset token.');
            setStatus('error');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setError('');
        setStatus('loading');
        try {
            await resetPassword(token, password);
            setStatus('success');
        } catch (err) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
            setStatus('error');
        }
    };

    return (
        <div className="auth-shell">
            <div className="site-background" aria-hidden="true">
                <div className="bg-orb bg-orb-primary" />
                <div className="bg-orb bg-orb-secondary" />
                <div className="mesh-grid" />
                <div className="bg-noise" />
            </div>

            <div style={{ position: 'absolute', top: '1.5rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                <BookOpen size={15} /> EduFeedback
            </div>

            <div className="animate-fade-in" style={{ maxWidth: '420px', width: '100%' }}>
                <div style={{
                    background: 'rgba(248,250,252,0.98)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(79,70,229,0.20)', borderRadius: 24,
                    padding: '2.5rem 2.25rem', boxShadow: '0 20px 60px rgba(15,23,42,0.14)',
                    position: 'relative',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Lock size={28} color="#fff" />
                        </div>
                        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.025em' }}>
                            Reset Password
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Please enter your new password below.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                            <div style={{ padding: '1.5rem', background: 'rgba(0,229,160,0.08)', borderRadius: 16, border: '1px solid rgba(0,229,160,0.2)', color: 'var(--success)', marginBottom: '1.5rem' }}>
                                <CheckCircle size={32} style={{ margin: '0 auto 0.75rem' }} />
                                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Password Reset Successful!</p>
                                <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>You can now sign in with your new password.</p>
                            </div>
                            <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                                Back to Login <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {error && (
                                <div className="alert alert-error animate-fade" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <div>
                                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>NEW PASSWORD</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        className="auth-input"
                                        placeholder="Min. 6 characters"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        disabled={status === 'loading' || !token}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>CONFIRM PASSWORD</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        className="auth-input"
                                        placeholder="Repeat new password"
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        required
                                        disabled={status === 'loading' || !token}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={status === 'loading' || !token}
                                style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem', opacity: (status === 'loading' || !token) ? 0.7 : 1 }}
                            >
                                {status === 'loading' ? 'Updating password...' : (<>Update Password <ArrowRight size={16} /></>)}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
