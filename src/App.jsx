import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import { Moon, Sun } from 'lucide-react';
import { useApp } from './context/AppContext';
import DynamicBackground from './components/DynamicBackground';
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AnalyzeFeedback from './pages/admin/AnalyzeFeedback';
import CreateForm from './pages/admin/CreateForm';
import ManageForms from './pages/admin/ManageForms';
import Courses from './pages/admin/Courses';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const AdminNavbar = () => {
  const { darkMode, toggleDarkMode } = useApp();
  const location = useLocation();
  const pageNames = {
    '/admin': 'Overview',
    '/admin/create': 'Create Form',
    '/admin/forms': 'Manage Forms',
    '/admin/analysis': 'Analytics',
    '/admin/courses': 'Courses',
  };
  const currentPage = pageNames[location.pathname] || 'Overview';
  return (
    <div className="admin-top-navbar">
      <div className="admin-top-navbar-inner">
        <div>
          <div className="admin-top-page-name">{currentPage}</div>
          <div className="admin-top-page-sub">Welcome back, Admin 👋</div>
        </div>
        <div style={{ padding: '0.6rem' }} />
      </div>
    </div>
  );
};

const Layout = ({ children, role }) => (
  <div className="app-container">
    <DynamicBackground />
    <Sidebar role={role} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'transparent' }}>
      {role === 'student' && <Navbar role={role} />}
      {role === 'admin' && <AdminNavbar />}
      <main className="content-wrapper animate-fade-in" style={{ flex: 1, padding: role === 'admin' ? 0 : undefined }}>{children}</main>
      <Footer />
    </div>
  </div>
);

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
};

const LoginRoute = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/student'} replace />;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginRoute />} />

          <Route
            path="/student"
            element={(
              <ProtectedRoute role="student">
                <Layout role="student"><StudentDashboard /></Layout>
              </ProtectedRoute>
            )}
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={(
              <ProtectedRoute role="admin">
                <Layout role="admin"><AdminDashboard /></Layout>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/analysis"
            element={(
              <ProtectedRoute role="admin">
                <Layout role="admin"><AnalyzeFeedback /></Layout>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/create"
            element={(
              <ProtectedRoute role="admin">
                <Layout role="admin"><CreateForm /></Layout>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/forms"
            element={(
              <ProtectedRoute role="admin">
                <Layout role="admin"><ManageForms /></Layout>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/courses"
            element={(
              <ProtectedRoute role="admin">
                <Layout role="admin"><Courses /></Layout>
              </ProtectedRoute>
            )}
          />

          {/* Fallback */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
