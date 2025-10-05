import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Container,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useCustomHooks';
import { Loading } from '../components/Loading';
import { ErrorDisplay } from '../components/Error';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { values, errors, handleChange, handleBlur, validateForm } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      await login(values);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)' }}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
          `,
          zIndex: 0
        }}
      />

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, pt: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            justifyContent: 'flex-start',
            pt: 10
          }}
        >
          {/* Logo centralizada */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <img 
              src="/logo.png" 
              alt="Logo da Empresa" 
              style={{ 
                height: '50px', 
                width: 'auto'
              }} 
            />
          </Box>

          <Card 
            sx={{ 
              maxWidth: 400, 
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box textAlign="center" mb={3}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1a237e',
                    mb: 1
                  }}
                >
                  Acesso ao Sistema
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.9rem'
                  }}
                >
                  Entre com suas credenciais para acessar o sistema
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    mb: 2,
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                >
                  Entrar
                </Button>

                <Box textAlign="center">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Não tem uma conta?{' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      sx={{
                        color: '#1976d2',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Cadastre-se aqui
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;