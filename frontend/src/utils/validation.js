// Schemas de validação para formulários
export const validationSchemas = {
  login: {
    email: {
      required: 'Email é obrigatório',
      email: 'Email deve ter um formato válido'
    },
    password: {
      required: 'Senha é obrigatória'
    }
  },
  
  register: {
    name: {
      required: 'Nome é obrigatório',
      minLength: 'Nome deve ter pelo menos 2 caracteres',
      maxLength: 'Nome deve ter no máximo 100 caracteres'
    },
    email: {
      required: 'Email é obrigatório',
      email: 'Email deve ter um formato válido'
    },
    password: {
      required: 'Senha é obrigatória',
      minLength: 'Senha deve ter pelo menos 6 caracteres',
      pattern: 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'
    },
    confirmPassword: {
      required: 'Confirmação de senha é obrigatória',
      match: 'Senhas não coincidem'
    }
  }
};

// Funções de validação
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: {
      minLength: !minLength ? 'Senha deve ter pelo menos 6 caracteres' : null,
      pattern: !(hasUpperCase && hasLowerCase && hasNumbers) ? 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número' : null
    }
  };
};

export const validateName = (name) => {
  const trimmed = name.trim();
  if (!trimmed) return 'Nome é obrigatório';
  if (trimmed.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
  if (trimmed.length > 100) return 'Nome deve ter no máximo 100 caracteres';
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Confirmação de senha é obrigatória';
  if (password !== confirmPassword) return 'Senhas não coincidem';
  return null;
};

export default validationSchemas;
