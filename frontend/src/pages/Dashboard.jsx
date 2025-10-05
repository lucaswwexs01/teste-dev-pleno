import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add,
  Assessment,
  LocalGasStation,
  AttachMoney
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';
import { operationService } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Loading, LoadingBackdrop } from '../components/Loading';
import { ErrorDisplay } from '../components/Error';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getFuelTypeLabel, getOperationTypeLabel, getOperationTypeColor } = useConfig();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentOperations, setRecentOperations] = useState([]);
  const [difference, setDifference] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, operationsResponse, differenceResponse] = await Promise.all([
        operationService.getStatistics(),
        operationService.listOperations({ limit: 5 }),
        operationService.getPurchaseSaleDifference()
      ]);

      setStats(statsResponse.statistics);
      setRecentOperations(operationsResponse.operations || []);
      setDifference(differenceResponse.difference);
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingBackdrop open={true} />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadDashboardData} />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      p: 3
    }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1976d2',
            mb: 1
          }}
        >
          Dashboard
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 400
          }}
        >
          Bem-vindo, {user?.name}! Aqui está um resumo das suas operações.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 40, mr: 2, color: '#4CAF50' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                    {stats?.totalOperations || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total de Operações
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ fontSize: 40, mr: 2, color: '#2196F3' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                    {formatCurrency(stats?.totalValue || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Valor Total
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalGasStation sx={{ fontSize: 40, mr: 2, color: '#FF9800' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                    {`${stats?.totalQuantity || 0}L`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Quantidade Total
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {difference?.difference >= 0 ? 
                  <TrendingUp sx={{ fontSize: 40, mr: 2, color: '#4CAF50' }} /> : 
                  <TrendingDown sx={{ fontSize: 40, mr: 2, color: '#F44336' }} />
                }
                <Box>
                  <Typography variant="h4" component="div" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1, 
                    color: difference?.difference >= 0 ? '#4CAF50' : '#F44336'
                  }}>
                    {formatCurrency(difference?.difference || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Diferença Compra/Venda
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              color: '#1976d2',
              mb: 2
            }}
          >
            Ações Rápidas
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => navigate('/operations/new')}
            sx={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                border: '1px solid #4CAF50',
              }
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Add sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                Nova Operação
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Cadastrar nova operação de combustível
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => navigate('/operations')}
            sx={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                border: '1px solid #2196F3',
              }
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                Ver Operações
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Visualizar todas as operações
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => navigate('/reports')}
            sx={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                border: '1px solid #FF9800',
              }
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 48, color: '#FF9800', mb: 2 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                Relatórios
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Gerar relatórios detalhados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => navigate('/settings')}
            sx={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                border: '1px solid #9C27B0',
              }
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 48, color: '#9C27B0', mb: 2 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                Configurações
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Configurar sistema
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
              Operações Recentes
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/operations')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: 'white'
                }
              }}
            >
              Ver Todas
            </Button>
          </Box>

          {recentOperations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LocalGasStation sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#6c757d', mb: 1 }}>
                Nenhuma operação encontrada
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d', mb: 3 }}>
                Comece criando sua primeira operação
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/operations/new')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  }
                }}
              >
                Nova Operação
              </Button>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {recentOperations.map((operation, index) => (
                <React.Fragment key={operation.id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: getOperationTypeColor(operation.operationType),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        {operation.operationType === 'purchase' ? <TrendingUp /> : <TrendingDown />}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {getFuelTypeLabel(operation.fuelType)} - {getOperationTypeLabel(operation.type)}
                          </Typography>
                          <Chip
                            label={operation.month}
                            size="small"
                            sx={{
                              backgroundColor: getOperationTypeColor(operation.operationType),
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6c757d', mb: 0.5 }}>
                            Lançada em {formatDate(operation.createdAt)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ color: '#6c757d' }}>
                              Quantidade: {operation.quantity}L
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6c757d' }}>
                              Valor Unitário: {formatCurrency(operation.unitPrice)}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                              Total: {formatCurrency(operation.totalValue || 0)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentOperations.length - 1 && (
                    <Divider sx={{ opacity: 0.3 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;