import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ToDoPage } from './pages/ToDoPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { GitHubPage } from './pages/GitHubPage';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Allow both authenticated and guest users
const AuthenticatedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Redirect root to dashboard (which will redirect to login if needed) or login directly
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <AuthenticatedRoute>
                  <DashboardPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/todo"
              element={
                <AuthenticatedRoute>
                  <ToDoPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <AuthenticatedRoute>
                  <ProductPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <AuthenticatedRoute>
                  <CartPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/github"
              element={
                <ProtectedRoute>
                  <GitHubPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;