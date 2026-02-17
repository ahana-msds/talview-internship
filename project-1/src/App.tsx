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

// Feature pages wrapped in appropriate route guards
import AdminDashboard from './pages/AdminDashboard';
import { GlobalFlagIssue } from './components/GlobalFlagIssue';

/**
 * ProtectedRoute: Wraps components that require authentication.
 */
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/**
 * AdminRoute: Restricts access to users with the 'admin' role.
 */
const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.email !== 'admin@talview.com') {
    return <Navigate to="/dashboard" replace />;
  }
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
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
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
          <GlobalFlagIssue />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;