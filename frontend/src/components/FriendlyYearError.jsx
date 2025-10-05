import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert
} from '@mui/material';
import {
  SentimentVerySatisfied,
  CalendarToday,
  Refresh
} from '@mui/icons-material';

const FriendlyYearError = ({ onRetry }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 500,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <SentimentVerySatisfied
          sx={{
            fontSize: 80,
            mb: 2,
            color: '#FFD700'
          }}
        />
        
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Ops! 😊
        </Typography>
        
        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 3,
            lineHeight: 1.6
          }}
        >
          O desafio técnico só passou a tabela de preços e tributos do ano de 2024
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 3,
            p: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2
          }}
        >
          <CalendarToday sx={{ fontSize: 24 }} />
          <Typography variant="body1">
            Tente criar operações para o ano de 2024
          </Typography>
        </Box>
        
        {onRetry && (
          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={onRetry}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              },
              px: 4,
              py: 1.5,
              borderRadius: 2
            }}
          >
            Tentar Novamente
          </Button>
        )}
      </Paper>
      
      <Alert
        severity="info"
        sx={{
          mt: 3,
          maxWidth: 500,
          borderRadius: 2
        }}
      >
        <Typography variant="body2">
          💡 <strong>Dica:</strong> Selecione o ano 2024 no formulário para criar suas operações com sucesso!
        </Typography>
      </Alert>
    </Box>
  );
};

export default FriendlyYearError;
