import { useState, useEffect, useCallback } from 'react';
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from '../utils/validation';

/**
 * Hook para gerenciar estado de loading
 * @param {boolean} initialValue - Valor inicial
 * @returns {Array} [loading, setLoading, withLoading]
 */
export const useLoading = (initialValue = false) => {
  const [loading, setLoading] = useState(initialValue);

  const withLoading = useCallback(async (asyncFunction) => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return [loading, setLoading, withLoading];
};

/**
 * Hook para gerenciar estado de erro
 * @param {string} initialValue - Valor inicial
 * @returns {Array} [error, setError, clearError]
 */
export const useError = (initialValue = null) => {
  const [error, setError] = useState(initialValue);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return [error, setError, clearError];
};

/**
 * Hook para gerenciar estado de formulário
 * @param {Object} initialValues - Valores iniciais
 * @returns {Object} Estado e funções do formulário
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando campo é alterado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const validateField = useCallback((name, value) => {
    // Validações específicas para cada campo
    switch (name) {
      case 'email':
        if (!value) return 'Email é obrigatório';
        if (!validateEmail(value)) return 'Email deve ter um formato válido';
        return null;
        
      case 'password':
        if (!value) return 'Senha é obrigatória';
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          return passwordValidation.errors.minLength || passwordValidation.errors.pattern;
        }
        return null;
        
      case 'name':
        return validateName(value);
        
      case 'confirmPassword':
        return validateConfirmPassword(values.password, value);
        
      default:
        return null;
    }
  }, [values.password]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    // Validar cada campo
    Object.keys(values).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setValue(name, newValue);
  }, [setValue]);

  const handleBlur = useCallback((event) => {
    const { name, value } = event.target;
    setFieldTouched(name);
    
    const error = validateField(name, value);
    if (error) {
      setFieldError(name, error);
    }
  }, [setFieldTouched, validateField, setFieldError]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    setFieldError,
    validateField,
    validateForm,
    resetForm,
    handleChange,
    handleBlur,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Hook para debounce de valores
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em ms
 * @returns {any} Valor com debounce
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para gerenciar estado local com persistência
 * @param {string} key - Chave no localStorage
 * @param {any} initialValue - Valor inicial
 * @returns {Array} [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * Hook para gerenciar paginação
 * @param {number} initialPage - Página inicial
 * @param {number} initialLimit - Limite inicial
 * @returns {Object} Estado e funções de paginação
 */
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
    setTotal(0);
  }, [initialPage]);

  return {
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    resetPagination
  };
};

/**
 * Hook para gerenciar filtros
 * @param {Object} initialFilters - Filtros iniciais
 * @returns {Object} Estado e funções de filtros
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters
  };
};

