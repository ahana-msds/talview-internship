// Routing components from react-router-dom
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context providers for Auth and Theme management
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Page components representing different views in the app
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ToDoPage } from './pages/ToDoPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { GitHubPage } from './pages/GitHubPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AddressPage } from './pages/AddressPage';

/**
 * ProtectedRoute: Wraps components that require authentication.
 * Redirects to /login if the user is not authenticated.
 */
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/**
 * AuthenticatedRoute: Wraps components that require at least a guest session or full login.
 */
const AuthenticatedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/**
 * RootRedirect: Handles the logic for the initial root (/) route.
 * Redirects to /dashboard if logged in, otherwise to /login.
 */
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

/**
 * Main App component that defines the application structure and routing.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Feature pages wrapped in appropriate route guards */}
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
              path="/product/:id"
              element={
                <AuthenticatedRoute>
                  <ProductDetailPage />
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
              path="/profile"
              element={
                <AuthenticatedRoute>
                  <ProfilePage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/addresses"
              element={
                <AuthenticatedRoute>
                  <AddressPage />
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