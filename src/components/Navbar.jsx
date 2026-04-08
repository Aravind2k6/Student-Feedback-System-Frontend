import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, Menu, User, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = ({ role, toggleSidebar }) => {
    const navigate = useNavigate();
    const { currentUser, darkMode, toggleDarkMode } = useApp();

    const userName = (currentUser && currentUser.name) ? currentUser.name : (role === 'student' ? 'Student' : 'Admin User');
    const userInitial = userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : (role === 'student' ? 'S' : 'A');

    return (
        <nav className="dashboard-navbar">
            <div className="dashboard-navbar-inner">
                {/* Left side - Mobile menu button (optional) & Logo for smaller screens */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {toggleSidebar && (
                        <button className="mobile-menu-btn" onClick={toggleSidebar} style={{ display: 'none' /* handled by CSS media query later if needed */ }}>
                            <Menu size={20} color="var(--text-secondary)" />
                        </button>
                    )}
                </div>

                {/* Right side - User profile & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{userName}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{role === 'student' ? 'Student' : 'Admin'}</div>
                        </div>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-gradient)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.9rem', fontWeight: 700, color: '#fff',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                        }}>
                            {userInitial}
                        </div>
                    </div>

                    <div style={{ width: 1, height: 24, background: 'var(--glass-border)' }}></div>

                    <div style={{ width: 1, height: 24, background: 'var(--glass-border)' }}></div>

                    <button
                        onClick={() => navigate('/')}
                        className="btn-ghost"
                        style={{ padding: '0.45rem 0.85rem', color: 'var(--error)', gap: '0.4rem', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                        <LogOut size={16} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
