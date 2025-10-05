import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OperationsList from './pages/OperationsList';
import OperationForm from './pages/OperationForm';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente para rotas públicas (apenas para usuários não autenticados)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Componente principal da aplicação
const AppContent = () => {
  return (
    <Router>
      <Routes>
        {/* Rota raiz redireciona para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rotas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/operations"
          element={
            <ProtectedRoute>
              <Layout>
                <OperationsList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/operations/new"
          element={
            <ProtectedRoute>
              <Layout>
                <OperationForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/operations/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <OperationForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rota padrão */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

// Componente principal
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ConfigProvider>
          <AppContent />
        </ConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

