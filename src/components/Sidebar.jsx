import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ClipboardList, PieChart, BookOpen, LogOut, ChevronRight, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = ({ role }) => {
    const navigate = useNavigate();
    const { currentUser } = useApp();

    const studentLinks = [
        { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={18} />, end: true },
    ];

    const adminLinks = [
        { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} />, end: true },
        { name: 'Create Form', path: '/admin/create', icon: <PlusCircle size={18} /> },
        { name: 'Manage Forms', path: '/admin/forms', icon: <ClipboardList size={18} /> },
        { name: 'Analytics', path: '/admin/analysis', icon: <PieChart size={18} /> },
        { name: 'Courses', path: '/admin/courses', icon: <GraduationCap size={18} /> },
    ];

    const links = role === 'student' ? studentLinks : adminLinks;
    const userLabel = role === 'student' ? 'Student' : 'Admin';

    const userName = (currentUser && currentUser.name) ? currentUser.name : (role === 'student' ? 'Student' : 'Admin User');
    const userInitial = userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : (role === 'student' ? 'S' : 'A');

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon"><BookOpen size={18} color="#fff" strokeWidth={2.5} /></div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>EduFeedback</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Evaluation System</div>
                </div>
            </div>

            {/* Section Label */}
            {role === 'admin' && (
                <p className="sidebar-section-label">Administration</p>
            )}

            <nav className="nav-links">
                {links.map(link => (
                    <NavLink key={link.path} to={link.path} end={!!link.end}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        {link.icon}
                        <span style={{ flex: 1 }}>{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-divider" />
                {/* User info at bottom */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
                    <div className="sidebar-user-avatar">{userInitial}</div>
                    <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{userName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>{userLabel}</div>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0.2rem' }}
                        title="Logout"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
