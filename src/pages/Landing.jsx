import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicBackground from '../components/DynamicBackground';
import {
    BookOpen, MessageSquare, BarChart3, ShieldCheck, Users, TrendingUp,
    ArrowRight, CheckCircle, Zap, Bell, ChevronRight, Github, Twitter,
    Linkedin, Menu, X
} from 'lucide-react';

/* ── Navbar ──────────────────────────────────────────── */
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-inner">
                    <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', gap: '0.8rem' }}>
                        <div className="landing-brand-icon">
                            <BookOpen size={18} color="#0d1627" strokeWidth={2.5} />
                        </div>
                        <span className="landing-brand-text" style={{ color: '#f8fafc' }}>EduFeedback</span>
                    </div>

                    <div className="navbar-links">
                        <span className="navbar-link" style={{ color: 'rgba(245, 247, 251, 0.95)' }} onClick={() => scrollTo('home')}>Home</span>
                        <span className="navbar-link" style={{ color: 'rgba(245, 247, 251, 0.95)' }} onClick={() => scrollTo('features')}>Features</span>
                        <span className="navbar-link" style={{ color: 'rgba(245, 247, 251, 0.95)' }} onClick={() => scrollTo('about')}>About</span>
                        <span className="navbar-link" style={{ color: 'rgba(245, 247, 251, 0.95)' }} onClick={() => scrollTo('contact')}>Contact</span>
                    </div>

                    <div className="navbar-actions">
                        <button className="landing-login-btn" onClick={() => navigate('/login')}>
                            Login
                        </button>
                        <button className="btn-primary landing-cta-btn" onClick={() => navigate('/login')}>
                            Get Started <ArrowRight size={17} />
                        </button>
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-label="Toggle navigation menu"
                        >
                            {menuOpen ? <X size={20} color="#ffffff" /> : <Menu size={20} color="#ffffff" />}
                        </button>
                    </div>
                </div>
            </nav>

            {menuOpen && (
                <div className="landing-mobile-menu animate-fade">
                    {['home', 'features', 'about', 'contact'].map(id => (
                        <a key={id} className="navbar-link" onClick={() => scrollTo(id)}
                            style={{ display: 'block', padding: '0.8rem 0', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer', textTransform: 'capitalize' }}>
                            {id}
                        </a>
                    ))}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { navigate('/login'); setMenuOpen(false); }}>Login</button>
                        <button className="btn-primary" style={{ flex: 1 }} onClick={() => { navigate('/login'); setMenuOpen(false); }}>Get Started</button>
                    </div>
                </div>
            )}
        </>
    );
};

/* ── Hero Section ─────────────────────────────────────── */
const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <header id="home" className="hero-section">
            <div
                className="section-inner landing-hero-inner"
                style={{ maxWidth: '860px', textAlign: 'center' }}
            >
                <div className="animate-fade-in" style={{ marginBottom: '0.35rem' }}>
                    <div
                        className="badge-pill"
                        style={{
                            padding: '0.58rem 1.18rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '-0.01em',
                            color: 'var(--accent-primary)',
                            borderColor: 'rgba(79, 70, 229, 0.34)',
                            background: 'rgba(79, 70, 229, 0.07)',
                        }}
                    >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)' }}></div>
                        Smart Feedback Platform for Education
                    </div>
                </div>

                <h1
                    className="hero-title landing-hero-title animate-fade-in"
                    style={{
                        fontSize: 'clamp(3.2rem, 6.1vw, 5.4rem)',
                        lineHeight: 0.92,
                        letterSpacing: '-0.055em',
                        marginBottom: '1.3rem',
                        color: 'var(--bg-navy)',
                    }}
                >
                    <span className="gold-text">Student Feedback</span> <br />
                    & Evaluation System
                </h1>

                <p
                    className="hero-subtitle landing-hero-subtitle animate-fade-in"
                    style={{
                        maxWidth: '660px',
                        margin: '0 auto 2.45rem',
                        fontSize: '0.9rem',
                        lineHeight: 1.78,
                        letterSpacing: '-0.01em',
                        color: '#5b6477',
                    }}
                >
                    A modern, intuitive platform for institutions to gather, analyze, and act on
                    student feedback - turning insights into educational excellence.
                </p>

                <div
                    className="hero-buttons landing-hero-actions animate-fade-in"
                    style={{ gap: '1rem', justifyContent: 'center' }}
                >
                    <button
                        className="btn-primary landing-student-btn"
                        style={{ minWidth: 232, minHeight: 62, padding: '0.95rem 1.8rem', fontSize: '0.9rem' }}
                        onClick={() => navigate('/login')}
                    >
                        Student Login <ArrowRight size={22} />
                    </button>
                    <button
                        className="btn-secondary landing-admin-btn"
                        style={{ minWidth: 232, minHeight: 62, padding: '0.95rem 1.8rem', fontSize: '0.9rem' }}
                        onClick={() => navigate('/login')}
                    >
                        <ShieldCheck size={22} /> Admin Portal
                    </button>
                </div>

                <p
                    className="landing-hero-note animate-fade-in"
                    style={{ marginTop: '3.2rem', fontSize: '0.86rem', color: '#6b7384' }}
                >
                    Feedback that fuels educational excellence.
                </p>
            </div>
        </header>
    );
};

/* ── Features Section ─────────────────────────────────── */
const FeaturesSection = ({ onLearnMore }) => {
    const features = [
        {
            icon: <MessageSquare size={24} />,
            title: 'Submit Feedback',
            desc: 'Students can easily submit structured feedback for every course with an intuitive rating system.',
            color: '#4f46e5',
            bg: 'rgba(79, 70, 229, 0.12)',
            details: [
                'Intuitive star rating system for overall satisfaction',
                'Categorized feedback for curriculum, teaching, and infrastructure',
                'Anonymous submission options to encourage honest feedback',
                'Mobile-friendly interface for feedback on-the-go',
                'Support for both text-based comments and quantitative metrics'
            ]
        },
        {
            icon: <BarChart3 size={24} />,
            title: 'Analytics Dashboard',
            desc: 'Real-time charts and analytics help administrators understand trends and improve teaching quality.',
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.12)',
            details: [
                'Visual representation of satisfaction trends over time',
                'Comparative analysis between different departments and courses',
                'Identification of high-performing areas and points for improvement',
                'Filtered views by semester, cohort, or specific instructor',
                'Exportable charts for stakeholders and board meetings'
            ]
        },
        {
            icon: <ShieldCheck size={24} />,
            title: 'Secure & Private',
            desc: 'Role-based authentication ensures only authorized users access sensitive feedback data.',
            color: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.12)',
            details: [
                'End-to-end encryption for all feedback submissions',
                'Multi-level permissions for students, faculty, and administrators',
                'GDPR and data privacy compliance as a standard',
                'Secure login with institutional credentials',
                'Audit logs to track administrative access to sensitive data'
            ]
        },
        {
            icon: <BookOpen size={24} />,
            title: 'Custom Forms',
            desc: 'Admins can create tailored feedback forms for specific courses with multiple question types.',
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.12)',
            details: [
                'Drag-and-drop form builder for easy customization',
                'Templates for end-of-semester, mid-term, and event feedback',
                'Support for multiple choice, scale, and open-ended questions',
                'Conditional logic to skip or show questions based on previous answers',
                'Reusable question banks for institutional consistency'
            ]
        },
        {
            icon: <TrendingUp size={24} />,
            title: 'View Reports',
            desc: 'Generate comprehensive reports with export options to track institutional performance over time.',
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.12)',
            details: [
                'Automated PDF report generation for faculty and departments',
                'In-depth sentiment analysis of open-ended student comments',
                'Benchmarking against historical institution-wide averages',
                'Action trackers to monitor improvements based on feedback',
                'Scheduled reporting delivered directly to administrative emails'
            ]
        },
        {
            icon: <Users size={24} />,
            title: 'Student Management',
            desc: 'Admins can manage student records, monitor activity, and group feedback by cohort or subject.',
            color: '#8b5cf6',
            bg: 'rgba(139, 92, 246, 0.12)',
            details: [
                'Bulk upload and management of student and faculty lists',
                'Categorization by major, graduation year, or specific sections',
                'Participation tracking to identify and encourage engagement',
                'Automated reminders for pending feedback submissions',
                'Integration with existing Student Information Systems (SIS)'
            ]
        },
    ];

    return (
        <section id="features" className="section" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(13,22,39,0.5) 100%)' }}>
            <div className="section-inner">
                <div className="section-header">
                    <p className="section-label" style={{ color: 'var(--accent-primary)', fontWeight: 800, display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Platform Features</p>
                    <h2 className="section-title">Everything You Need for<br /><span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Better Education</span></h2>
                    <p className="section-description">Powerful tools designed to bridge the gap between students and educators through actionable insights.</p>
                </div>

                <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {features.map((f, i) => (
                        <div key={i} className="feature-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="feature-icon-wrap" style={{ background: f.bg }}>
                                <span style={{ color: f.color }}>{f.icon}</span>
                            </div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                            <div
                                onClick={() => onLearnMore(f)}
                                style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: f.color, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Learn more <ChevronRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ── How It Works ─────────────────────────────────────── */
const HowItWorks = () => {
    const steps = [
        { n: '01', title: 'Admin Creates Forms', desc: 'Administrators design custom evaluation forms for each course or faculty member.' },
        { n: '02', title: 'Students Submit Feedback', desc: 'Students log in securely and submit honest ratings and comments for their courses.' },
        { n: '03', title: 'Analyze & Improve', desc: 'Admins review analytics dashboards and generate reports to drive improvements.' },
    ];

    return (
        <section className="section">
            <div className="section-inner">
                <div className="section-header">
                    <p className="section-label" style={{ color: 'var(--accent-primary)', fontWeight: 800, display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>How It Works</p>
                    <h2 className="section-title">Simple. Smart. Effective.</h2>
                    <p className="section-description">Three easy steps to revolutionize your institution's feedback collection process.</p>
                </div>

                <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                    {steps.map((s, i) => (
                        <div key={i} className="glass-panel step-card animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                            <div className="step-number">{s.n}</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{s.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ── About Section ────────────────────────────────────── */
const AboutSection = () => (
    <section id="about" className="section" style={{ background: 'linear-gradient(180deg, rgba(13,22,39,0.3) 0%, var(--bg-primary) 100%)' }}>
        <div className="section-inner">
            <div className="animate-fade-in">
                <p className="section-label">About</p>
                <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    Empowering Educational Excellence Through Data
                </h2>

                <div className="grid-2" style={{ gap: '3rem', alignItems: 'start' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                            EduFeedback was built with a clear mission: to give every student a voice and every educator the insights they need to grow. Our platform eliminates traditional paper-based surveys and replaces them with a dynamic, real-time digital system.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1.05rem' }}>
                            From small coaching centers to large universities, our system adapts to your institution's unique needs while maintaining simplicity and privacy. We believe that better feedback leads to better teaching, and better teaching leads to better futures.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Key Advantages</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                            {[
                                { label: 'Real-time Feedback & Analysis', icon: <Zap size={18} />, desc: 'Instant insights into student satisfaction.' },
                                { label: 'Secure & Private Platform', icon: <ShieldCheck size={18} />, desc: 'Role-based access for data protection.' },
                                { label: 'Comprehensive Reporting', icon: <BarChart3 size={18} />, desc: 'Generate exportable PDF and CSV reports.' },
                                { label: 'Full Mobile Compatibility', icon: <Bell size={18} />, desc: 'Accessible on any device, anywhere.' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                    <div style={{ color: 'var(--accent-primary)', marginTop: '0.2rem' }}>{item.icon}</div>
                                    <div>
                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>{item.label}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

/* ── Contact Section ──────────────────────────────────── */
const ContactSection = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <section id="contact" className="section">
            <div className="section-inner">
                <div className="section-header">
                    <p className="section-label">Team</p>
                    <h2 className="section-title">Developed By</h2>
                    <p className="section-description">Built with passion by our development team.</p>
                </div>

                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="animate-fade-in glass-panel" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            {[
                                { icon: <Users size={20} />, label: '2400030040', val: 'Aravind' },
                                { icon: <Users size={20} />, label: '2400030439', val: 'Jaswanth' },
                                { icon: <Users size={20} />, label: '2400032357', val: 'Anish' },
                            ].map((c, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                                        {c.icon}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{c.label}</div>
                                    <div style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600 }}>{c.val}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '2.5rem', textAlign: 'center', padding: '1rem', borderRadius: 12, background: 'rgba(79, 70, 229, 0.07)', border: '1px solid rgba(79, 70, 229, 0.15)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            🎓 Built as part of a <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Student Feedback System</span> project to streamline academic feedback collection.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ── Footer ───────────────────────────────────────────── */
const Footer = () => {
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <div style={{ background: 'var(--accent-gradient)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BookOpen size={16} color="#000d1a" />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>EduFeedback</span>
                        </div>
                        <p>Empowering educators and students with smart feedback tools to improve educational experiences.</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" style={{ width: 36, height: 36, border: '1px solid var(--glass-border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'var(--transition)' }}
                                    onMouseOver={e => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'rgba(79,70,229,0.35)'; }}
                                    onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Navigation</h4>
                        {['Home', 'Features', 'About', 'Contact'].map(l => (
                            <a key={l} href="#" onClick={e => { e.preventDefault(); scrollTo(l.toLowerCase()); }}>{l}</a>
                        ))}
                    </div>

                    <div className="footer-col">
                        <h4>Platform</h4>
                        {['Student Portal', 'Admin Dashboard', 'Analytics', 'Reports'].map(l => <a key={l} href="#">{l}</a>)}
                    </div>

                    <div className="footer-col">
                        <h4>Support</h4>
                        {['Documentation', 'Help Center', 'Privacy Policy', 'Terms of Use'].map(l => <a key={l} href="#">{l}</a>)}
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© 2026 EduFeedback. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
};

/* ── Feature Modal ────────────────────────────────────── */
const FeatureModal = ({ feature, onClose }) => {
    if (!feature) return null;

    return (
        <div className="animate-fade" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(7, 13, 26, 0.85)', backdropFilter: 'blur(8px)',
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }} onClick={onClose}>
            <div className="glass-panel animate-scale-up" style={{
                maxWidth: '600px', width: '100%', padding: '2.5rem',
                position: 'relative', border: `1px solid ${feature.color}33`
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1.5rem', right: '1.5rem',
                        background: 'none', border: 'none', color: 'var(--text-muted)',
                        cursor: 'pointer', transition: 'var(--transition)'
                    }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <X size={24} />
                </button>

                <div style={{
                    width: 60, height: 60, borderRadius: 16, background: feature.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: feature.color, marginBottom: '1.5rem'
                }}>
                    {feature.icon}
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    {feature.title}
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    {feature.desc}
                </p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {feature.details.map((detail, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                            <div style={{ marginTop: '0.3rem', color: feature.color }}>
                                <CheckCircle size={18} />
                            </div>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                {detail}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    className="btn-primary"
                    style={{ marginTop: '2.5rem', width: '100%', background: feature.color }}
                    onClick={onClose}
                >
                    Close Preview
                </button>
            </div>
        </div>
    );
};

/* ── Main Landing Page ────────────────────────────────── */
const Landing = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <div className="landing-page-shell" style={{ position: 'relative' }}>
            <DynamicBackground />
            <Navbar />
            <HeroSection />
            <FeaturesSection onLearnMore={setSelectedFeature} />
            <HowItWorks />
            <AboutSection />
            <ContactSection />
            <Footer />

            {selectedFeature && (
                <FeatureModal
                    feature={selectedFeature}
                    onClose={() => setSelectedFeature(null)}
                />
            )}
        </div>
    );
};

export default Landing;
