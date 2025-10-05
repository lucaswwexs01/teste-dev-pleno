import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Backdrop
} from '@mui/material';

/**
 * Componente de loading simples
 */
export const Loading = ({ size = 40, message = 'Carregando...' }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    p={3}
  >
    <CircularProgress size={size} />
    {message && (
      <Typography variant="body2" sx={{ mt: 2 }}>
        {message}
      </Typography>
    )}
  </Box>
);

/**
 * Componente de loading com backdrop
 */
export const LoadingBackdrop = ({ open, message = 'Carregando...' }) => (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
  >
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress color="inherit" />
      {message && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  </Backdrop>
);

/**
 * Componente de loading para botões
 */
export const ButtonLoading = ({ loading, children, ...props }) => (
  <Box position="relative">
    {children}
    {loading && (
      <CircularProgress
        size={24}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-12px',
          marginLeft: '-12px',
        }}
      />
    )}
  </Box>
);

export default Loading;

