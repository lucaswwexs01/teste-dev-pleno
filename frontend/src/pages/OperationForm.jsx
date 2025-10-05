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
  Stepper,
  Step,
  StepLabel,
  Paper
} from '@mui/material';
import {
  Save,
  ArrowBack,
  LocalGasStation,
  AttachMoney,
  Assessment
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { operationService } from '../services/api';
import { formatCurrency, getFuelTypeName, getOperationTypeName, getMonthName } from '../utils/formatters';
import { useForm } from '../hooks/useCustomHooks';
import { Loading } from '../components/Loading';
import { ErrorDisplay } from '../components/Error';
import FriendlyYearError from '../components/FriendlyYearError';

const OperationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isYearError, setIsYearError] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const { values, errors, handleChange, handleBlur, validateForm, setValue } = useForm({
    type: '',
    fuelType: '',
    quantity: '',
    month: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    if (isEdit) {
      loadOperation();
    }
  }, [id]);

  const loadOperation = async () => {
    try {
      setLoading(true);
      const response = await operationService.getOperationById(id);
      const operation = response.operation;
      
      setValue('type', operation.type);
      setValue('fuelType', operation.fuelType);
      setValue('quantity', operation.quantity.toString());
      setValue('month', operation.month.toString());
      setValue('year', operation.year.toString());
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao carregar operação');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Dados Básicos',
    'Valores',
    'Confirmação'
  ];

  const handleNext = () => {
    setIsYearError(false);
    setError(null);
    
    if (activeStep === 0) {
      if (validateForm()) {
        calculatePreview();
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleYearChange = (e) => {
    handleChange(e);
    setIsYearError(false);
    setError(null);
  };

  const calculatePreview = async () => {
    try {
      const quantity = parseFloat(values.quantity);
      const unitPrice = getUnitPrice(values.fuelType, values.type);
      const taxRate = getTaxRate(values.fuelType, values.type);
      const selicRate = 11.5;

      const totalValue = calculateTotalValue(quantity, unitPrice, taxRate, selicRate);

      setPreviewData({
        quantity,
        unitPrice,
        taxRate,
        selicRate,
        totalValue,
        fuelType: values.fuelType,
        type: values.type,
        month: values.month,
        year: values.year
      });
    } catch (error) {
      setError('Erro ao calcular valores');
    }
  };

  const getUnitPrice = (fuelType, type) => {
    const prices = {
      gasoline: { purchase: 5.50, sale: 6.20 },
      ethanol: { purchase: 3.80, sale: 4.30 },
      diesel: { purchase: 4.20, sale: 4.80 }
    };
    return prices[fuelType]?.[type] || 0;
  };

  const getTaxRate = (fuelType, type) => {
    const rates = {
      gasoline: { purchase: 0.15, sale: 0.18 },
      ethanol: { purchase: 0.12, sale: 0.15 },
      diesel: { purchase: 0.10, sale: 0.12 }
    };
    return rates[fuelType]?.[type] || 0;
  };

  const calculateTotalValue = (quantity, unitPrice, taxRate, selicRate) => {
    const baseValue = quantity * unitPrice;
    const taxValue = baseValue * taxRate;
    const selicValue = baseValue * (selicRate / 100);
    return baseValue + taxValue + selicValue;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const operationData = {
        type: values.type,
        fuelType: values.fuelType,
        quantity: parseFloat(values.quantity),
        month: parseInt(values.month),
        year: parseInt(values.year)
      };

      if (isEdit) {
        await operationService.updateOperation(id, operationData);
      } else {
        await operationService.createOperation(operationData);
      }

      navigate('/operations');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao salvar operação';
      
      if (errorMessage.includes('desafio técnico') || errorMessage.includes('2024')) {
        setIsYearError(true);
        setError(null);
      } else {
        setIsYearError(false);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Tipo de Operação</InputLabel>
                <Select
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="type"
                  label="Tipo de Operação"
                >
                  <MenuItem value="purchase">Compra</MenuItem>
                  <MenuItem value="sale">Venda</MenuItem>
                </Select>
                {errors.type && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.type}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.fuelType}>
                <InputLabel>Tipo de Combustível</InputLabel>
                <Select
                  value={values.fuelType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="fuelType"
                  label="Tipo de Combustível"
                >
                  <MenuItem value="gasoline">Gasolina</MenuItem>
                  <MenuItem value="ethanol">Etanol</MenuItem>
                  <MenuItem value="diesel">Diesel</MenuItem>
                </Select>
                {errors.fuelType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.fuelType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade (L)"
                type="number"
                name="quantity"
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.quantity}
                helperText={errors.quantity}
                inputProps={{ min: 0.001, step: 0.001 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth error={!!errors.month}>
                <InputLabel>Mês</InputLabel>
                <Select
                  value={values.month}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="month"
                  label="Mês"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {getMonthName(i + 1)}
                    </MenuItem>
                  ))}
                </Select>
                {errors.month && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.month}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Ano"
                type="number"
                name="year"
                value={values.year}
                onChange={handleYearChange}
                onBlur={handleBlur}
                error={!!errors.year}
                helperText={errors.year}
                inputProps={{ min: 2020, max: new Date().getFullYear() }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Resumo dos Valores
            </Typography>
            {previewData && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tipo: {getOperationTypeName(previewData.type)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Combustível: {getFuelTypeName(previewData.fuelType)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantidade: {previewData.quantity} L
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mês/Ano: {getMonthName(previewData.month)}/{previewData.year}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Preço Unitário: {formatCurrency(previewData.unitPrice)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Taxa de Imposto: {(previewData.taxRate * 100).toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Taxa SELIC: {previewData.selicRate}%
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Valor Total: {formatCurrency(previewData.totalValue)}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        );

      case 2:
        return (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              Confirmação
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Confirme os dados da operação antes de salvar.
            </Typography>
            {previewData && (
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="body2">
                  <strong>{getOperationTypeName(previewData.type)}</strong> de{' '}
                  <strong>{previewData.quantity} L</strong> de{' '}
                  <strong>{getFuelTypeName(previewData.fuelType)}</strong> em{' '}
                  <strong>{getMonthName(previewData.month)}/{previewData.year}</strong>
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  Valor Total: {formatCurrency(previewData.totalValue)}
                </Typography>
              </Paper>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading && isEdit) {
    return <Loading message="Carregando operação..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        title="Erro ao carregar operação"
        onRetry={isEdit ? loadOperation : undefined}
      />
    );
  }

  if (isYearError) {
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            {isEdit ? 'Editar Operação' : 'Nova Operação'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/operations')}
          >
            Voltar
          </Button>
        </Box>
        <FriendlyYearError onRetry={() => setIsYearError(false)} />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Editar Operação' : 'Nova Operação'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/operations')}
        >
          Voltar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OperationForm;
