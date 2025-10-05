// Teste simples para verificar se a API está funcionando
const testAPI = async () => {
  try {
    console.log('Testando conexão com a API...');
    
    // Teste de health check
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Teste de registro
    const registerData = {
      name: 'Teste Usuario',
      email: 'teste@example.com',
      password: 'Teste123'
    };
    
    console.log('Testando registro...');
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });
    
    const registerResult = await registerResponse.json();
    console.log('Resultado do registro:', registerResult);
    
    if (registerResponse.ok) {
      // Teste de login
      console.log('Testando login...');
      const loginData = {
        email: 'teste@example.com',
        password: 'Teste123'
      };
      
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
      
      const loginResult = await loginResponse.json();
      console.log('Resultado do login:', loginResult);
    }
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
};

// Executar teste se estiver no navegador
if (typeof window !== 'undefined') {
  testAPI();
}

export default testAPI;
