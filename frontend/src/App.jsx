import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Teamspaces from './pages/Teamspaces';
import AcceptInvite from './pages/AcceptInvite';
import TeamspaceDetail from './pages/TeamspaceDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/teamspaces"
          element={
            <ProtectedRoute>
              <Layout>
                <Teamspaces />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invite/accept"
          element={<AcceptInvite />}
        />
        <Route 
          path="/teamspace/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <TeamspaceDetail />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
