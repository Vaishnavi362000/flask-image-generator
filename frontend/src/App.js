import React, {useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import Dashboard from './pages/DashboardPage';
import Generate from './pages/Generate';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin', { state: { from: location } });
    }
  }, [user, loading, navigate, location]);
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : null;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/generate" element={
          <PrivateRoute>
            <Layout>
              <Generate />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;