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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { operationService } from '../services/api';
import { formatCurrency, getFuelTypeName, getOperationTypeName, getOperationTypeColor, formatDate, getMonthName } from '../utils/formatters';
import { useForm } from '../hooks/useCustomHooks';
import { Loading } from '../components/Loading';
import { ErrorDisplay } from '../components/Error';

const OperationsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operations, setOperations] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    month: '',
    year: 2024,
    type: '',
    fuelType: ''
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, operation: null });

  useEffect(() => {
    loadOperations();
  }, [filters]);

  const loadOperations = async () => {
    try {
      setLoading(true);
      setError(null);

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );

      const response = await operationService.listOperations(cleanFilters);
      setOperations(response.operations);
      setPagination(response.pagination);
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao carregar operações');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset page when filters change
    }));
  };

  const handlePageChange = (event, page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = async (operation) => {
    try {
      await operationService.deleteOperation(operation.id);
      setDeleteDialog({ open: false, operation: null });
      loadOperations();
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao deletar operação');
    }
  };

  const handleEdit = (operation) => {
    navigate(`/operations/edit/${operation.id}`);
  };

  if (loading) {
    return <Loading message="Carregando operações..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        title="Erro ao carregar operações"
        onRetry={loadOperations}
      />
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Operações
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/operations/new')}
        >
          Nova Operação
        </Button>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filtros
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Informação:</strong> Apenas operações do ano de 2024 são exibidas.
            </Typography>
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
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
            <Grid item xs={12} sm={6} md={2}>
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
            <Grid item xs={12} sm={6} md={2}>
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Por página</InputLabel>
                <Select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', e.target.value)}
                  label="Por página"
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Search />}
                onClick={loadOperations}
                sx={{ height: '56px' }}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela de operações */}
      <Card>
        <CardContent>
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
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {operations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary" py={2}>
                        Nenhuma operação encontrada
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  operations.map((operation) => (
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
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(operation)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteDialog({ open: true, operation })}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, operation: null })}
      >
        <DialogTitle>
          Confirmar Exclusão
          <IconButton
            onClick={() => setDeleteDialog({ open: false, operation: null })}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta operação? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, operation: null })}>
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.operation)}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OperationsList;
