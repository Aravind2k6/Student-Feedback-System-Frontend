import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/student" element={<Layout role="student"><StudentDashboard /></Layout>} />

          {/* Admin */}
          <Route path="/admin" element={<Layout role="admin"><AdminDashboard /></Layout>} />
          <Route path="/admin/analysis" element={<Layout role="admin"><AnalyzeFeedback /></Layout>} />
          <Route path="/admin/create" element={<Layout role="admin"><CreateForm /></Layout>} />
          <Route path="/admin/forms" element={<Layout role="admin"><ManageForms /></Layout>} />
          <Route path="/admin/courses" element={<Layout role="admin"><Courses /></Layout>} />

          {/* Fallback */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
