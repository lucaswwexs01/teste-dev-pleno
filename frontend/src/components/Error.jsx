import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Typography
} from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

/**
 * Componente de erro simples
 */
export const ErrorAlert = ({ 
  error, 
  title = 'Erro', 
  onRetry = null,
  severity = 'error',
  ...props 
}) => {
  if (!error) return null;

  return (
    <Alert 
      severity={severity} 
      action={onRetry && (
        <Button color="inherit" size="small" onClick={onRetry}>
          Tentar Novamente
        </Button>
      )}
      {...props}
    >
      <AlertTitle>{title}</AlertTitle>
      {typeof error === 'string' ? error : error.message || 'Ocorreu um erro inesperado'}
    </Alert>
  );
};

/**
 * Componente de erro com ícone
 */
export const ErrorDisplay = ({ 
  error, 
  title = 'Ops! Algo deu errado',
  onRetry = null,
  ...props 
}) => {
  if (!error) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      textAlign="center"
      {...props}
    >
      <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {typeof error === 'string' ? error : error.message || 'Ocorreu um erro inesperado'}
      </Typography>
      
      {onRetry && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Tentar Novamente
        </Button>
      )}
    </Box>
  );
};

/**
 * Componente de erro para formulários
 */
export const FormError = ({ error, field = null }) => {
  if (!error) return null;

  const errorMessage = field ? error[field] : error;

  if (!errorMessage) return null;

  return (
    <Typography 
      variant="caption" 
      color="error" 
      sx={{ mt: 0.5, display: 'block' }}
    >
      {errorMessage}
    </Typography>
  );
};

/**
 * Componente de erro para páginas
 */
export const PageError = ({ 
  error, 
  title = 'Erro na Página',
  onRetry = null,
  ...props 
}) => {
  if (!error) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      p={4}
      {...props}
    >
      <ErrorDisplay 
        error={error} 
        title={title}
        onRetry={onRetry}
      />
    </Box>
  );
};

export default ErrorAlert;

