import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const StudentCourses = () => {
    const { courses } = useApp();

    const displayCourses = courses || [];

    return (
        <div>
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title animate-fade-in">Registered Courses</h1>
                    <p className="page-subtitle animate-fade-in animate-delay-1" style={{ marginBottom: 0 }}>
                        View your currently registered courses and assigned instructors.
                    </p>
                </div>
            </div>

            <div className="animate-fade-in animate-delay-2" style={{ maxWidth: '1000px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {displayCourses.map((course, idx) => {
                        const courseCode = course?.code || 'Unknown';
                        const courseName = course?.courseName || 'Unnamed Course';
                        const internalName = course?.name || '';
                        const credits = course?.credits || 0;
                        const instructorStr = (course?.instructor && typeof course.instructor === 'string') ? course.instructor : 'Unknown';
                        const instructorInit = instructorStr.charAt(0).toUpperCase();

                        return (
                            <div key={courseCode + idx} className="card animate-scale-in" style={{ animationDelay: `${idx * 0.1}s`, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                            <BookOpen size={15} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {courseCode}
                                            </span>
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                                            {courseName}
                                        </h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 600 }}>
                                            {internalName}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--accent-primary)', padding: '0.3rem 0.6rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700 }}>
                                        {credits} Credits
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', fontWeight: 800 }}>
                                        {instructorInit}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.1rem' }}>Instructor</div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{instructorStr}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {displayCourses.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 12 }}>
                            You are not registered for any courses currently.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentCourses;
