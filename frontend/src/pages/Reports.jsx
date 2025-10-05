import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Assessment,
  Refresh,
  TrendingUp,
  TrendingDown,
  LocalGasStation,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { operationService } from '../services/api';
import { formatCurrency, getFuelTypeName, getOperationTypeName, formatDate, getMonthName } from '../utils/formatters';
import { Loading } from '../components/Loading';
import { ErrorDisplay } from '../components/Error';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    month: '',
    year: new Date().getFullYear(),
    type: '',
    fuelType: ''
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );

      const response = await operationService.generateReport(cleanFilters);
      setReportData(response);
      
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };


  const StatCard = ({ title, value, icon, color = 'primary', trend = null }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend > 0 ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'}>
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <Loading message="Gerando relatório..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        title="Erro ao gerar relatório"
        onRetry={loadReport}
      />
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Relatórios
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadReport}
            sx={{ mr: 1 }}
          >
            Atualizar
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filtros do Relatório
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Informação:</strong> Apenas dados do ano de 2024 estão disponíveis nos relatórios.
            </Typography>
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Mês</InputLabel>
                <Select
                  value={filters.month}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                  label="Mês"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {getMonthName(i + 1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Ano"
                type="number"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  label="Tipo"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="purchase">Compra</MenuItem>
                  <MenuItem value="sale">Venda</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Combustível</InputLabel>
                <Select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  label="Combustível"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="gasoline">Gasolina</MenuItem>
                  <MenuItem value="ethanol">Etanol</MenuItem>
                  <MenuItem value="diesel">Diesel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {reportData && (
        <>
          {/* Estatísticas */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total de Operações"
                value={reportData.statistics?.totalOperations || 0}
                icon={<Assessment sx={{ fontSize: 40 }} />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Valor Total"
                value={formatCurrency(reportData.statistics?.totalValue || 0)}
                icon={<AttachMoney sx={{ fontSize: 40 }} />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Quantidade Total"
                value={`${(reportData.statistics?.totalQuantity || 0).toFixed(3)} L`}
                icon={<LocalGasStation sx={{ fontSize: 40 }} />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Diferença"
                value={formatCurrency(reportData.purchaseSaleDifference?.difference || 0)}
                icon={reportData.purchaseSaleDifference?.isPositive ? 
                  <TrendingUp sx={{ fontSize: 40 }} /> : 
                  <TrendingDown sx={{ fontSize: 40 }} />}
                color={reportData.purchaseSaleDifference?.isPositive ? 'success' : 'error'}
              />
            </Grid>
          </Grid>

          {/* Resumo de Compras vs Vendas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo de Compras vs Vendas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h5" color="error.main">
                      {formatCurrency(reportData.purchaseSaleDifference?.totalPurchases || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Compras
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h5" color="success.main">
                      {formatCurrency(reportData.purchaseSaleDifference?.totalSales || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Vendas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h5" 
                      color={reportData.purchaseSaleDifference?.isPositive ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(reportData.purchaseSaleDifference?.difference || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Diferença
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Operações */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Operações Detalhadas
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Combustível</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Valor Unitário</TableCell>
                      <TableCell>Valor Total</TableCell>
                      <TableCell>Mês/Ano</TableCell>
                      <TableCell>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.operations?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" color="text.secondary" py={2}>
                            Nenhuma operação encontrada
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      reportData.operations?.map((operation) => (
                        <TableRow key={operation.id}>
                          <TableCell>
                            <Chip
                              label={getOperationTypeName(operation.type)}
                              color={operation.type === 'purchase' ? 'error' : 'success'}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{getFuelTypeName(operation.fuelType)}</TableCell>
                          <TableCell>{operation.quantity} L</TableCell>
                          <TableCell>{formatCurrency(operation.unitPrice)}</TableCell>
                          <TableCell>{formatCurrency(operation.totalValue)}</TableCell>
                          <TableCell>{getMonthName(operation.month)}/{operation.year}</TableCell>
                          <TableCell>{formatDate(operation.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default Reports;
