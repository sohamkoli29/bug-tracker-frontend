import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { TicketProvider } from './context/TicketContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import PrivateRoute from './components/PrivateRoute';
import KanbanView from './pages/KanbanView';
function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TicketProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <PrivateRoute>
                    <Projects />
                  </PrivateRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <PrivateRoute>
                    <ProjectDetail />
                  </PrivateRoute>
                }
              />
              <Route
  path="/projects/:id/kanban"
  element={
    <PrivateRoute>
      <KanbanView />
    </PrivateRoute>
  }
/>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </TicketProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;