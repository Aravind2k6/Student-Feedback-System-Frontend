import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, Users, ChevronRight, BarChart3, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Courses = () => {
    const navigate = useNavigate();
    const { courses, toggleCourseRelease } = useApp();

    return (
        <div className="admin-courses-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Course Management</h1>
                    <p className="page-subtitle">View and manage all registered courses and their performance.</p>
                </div>
            </div>

            <div className="grid-auto">
                {courses.map((course, i) => (
                    <div key={i} className="glass-panel course-card" style={{ opacity: course.released ? 1 : 0.7 }}>
                        <div className="course-card-header">
                            <div className="course-icon-bg">
                                <BookOpen size={20} color="var(--accent-primary)" />
                            </div>
                            <div className="course-badges" style={{ display: 'flex', gap: '0.5rem' }}>
                                <span className={`admin-ov-status-badge ${course.released ? 'status-active' : 'status-draft'}`} style={{ fontSize: '0.65rem' }}>
                                    {course.released ? 'Released' : 'Hidden'}
                                </span>
                                <span className="admin-ov-credit-badge">{course.credits} Credits</span>
                            </div>
                        </div>

                        <div className="course-card-body">
                            <h3 className="course-title-primary">{course.name}</h3>
                            <p className="course-code-secondary">{course.code}</p>

                            <div className="course-meta-grid">
                                <div className="course-meta-item">
                                    <Clock size={14} />
                                    <span>{course.courseName}</span>
                                </div>
                            </div>

                            <div className="course-instructor-info">
                                <span className="label">Instructor:</span>
                                <span className="value">{course.instructor}</span>
                            </div>
                        </div>

                        <div className="course-card-footer" style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <button
                                className="btn-secondary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 0.5rem', fontSize: '0.85rem' }}
                                onClick={() => navigate('/admin/analysis', { state: { filterCourse: course.name } })}
                            >
                                <BarChart3 size={14} />
                                Analysis
                            </button>
                            <button
                                className={`btn-${course.released ? 'danger' : 'success'}`}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 0.5rem', fontSize: '0.85rem' }}
                                onClick={() => toggleCourseRelease(course.name)}
                            >
                                <Radio size={14} />
                                {course.released ? 'Unrelease' : 'Release'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            <style dangerouslySetInnerHTML={{
                __html: `
                .admin-courses-page .grid-auto {
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                }
                .course-card {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s ease, border-color 0.2s ease;
                }
                .course-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent-primary);
                }
                .course-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.25rem;
                }
                .course-icon-bg {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: rgba(124, 108, 245, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .course-title-primary {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }
                .course-code-secondary {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                .course-meta-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.25rem;
                }
                .course-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .course-instructor-info {
                    display: flex;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--glass-border);
                    margin-bottom: 1.25rem;
                }
                .course-instructor-info .label {
                    color: var(--text-muted);
                }
                .course-instructor-info .value {
                    color: var(--text-primary);
                    font-weight: 600;
                }
                .w-full {
                    width: 100%;
                }
            `}} />
        </div>
    );
};

export default Courses;
