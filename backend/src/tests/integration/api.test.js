const request = require('supertest');
const app = require('../../app');

// Verificar se o banco de dados está disponível
let sequelize;
let dbConnectionSuccessful = false;
try {
  sequelize = require('../../database/models').sequelize;
} catch (error) {
  console.warn('Banco de dados não disponível para testes de integração');
}

describe('API Tests', () => {
  beforeAll(async () => {
    // Conectar ao banco de dados de teste apenas se disponível
    if (sequelize) {
      try {
        await sequelize.authenticate();
        dbConnectionSuccessful = true;
      } catch (error) {
        console.warn('Não foi possível conectar ao banco de dados de teste:', error.message);
        dbConnectionSuccessful = false;
      }
    }
  });

  afterAll(async () => {
    // Fechar conexão com o banco de dados se disponível
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (error) {
        console.warn('Erro ao fechar conexão com banco de dados:', error.message);
      }
    }
  });

  // Função para verificar se deve pular testes que dependem do banco
  const shouldSkipDbTests = () => !dbConnectionSuccessful;

  describe('Health Check', () => {
    test('GET /api/health should return 200', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Authentication', () => {
    test('POST /api/auth/register should create a new user', async () => {
      if (shouldSkipDbTests()) {
        console.log('Pulando teste - banco de dados não disponível');
        return;
      }
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name', userData.name);
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('POST /api/auth/login should authenticate user', async () => {
      if (shouldSkipDbTests()) {
        console.log('Pulando teste - banco de dados não disponível');
        return;
      }
      const credentials = {
        email: 'test@example.com',
        password: 'TestPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    test('POST /api/auth/login should reject invalid credentials', async () => {
      if (shouldSkipDbTests()) {
        console.log('Pulando teste - banco de dados não disponível');
        return;
      }
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Operations', () => {
    let authToken;
    let userId;

    beforeAll(async () => {
      // Fazer login para obter token apenas se banco estiver disponível
      if (!shouldSkipDbTests()) {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'TestPassword123'
          });

        authToken = loginResponse.body.token;
        userId = loginResponse.body.user.id;
      }
    });

    test('POST /api/operations should create a new operation', async () => {
      if (shouldSkipDbTests()) {
        console.log('Pulando teste - banco de dados não disponível');
        return;
      }
      const operationData = {
        type: 'purchase',
        fuelType: 'gasoline',
        quantity: 100,
        month: 1,
        year: 2024
      };

      const response = await request(app)
        .post('/api/operations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(operationData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('operation');
      expect(response.body.operation).toHaveProperty('id');
      expect(response.body.operation).toHaveProperty('type', operationData.type);
      expect(response.body.operation).toHaveProperty('fuelType', operationData.fuelType);
      expect(response.body.operation).toHaveProperty('quantity', operationData.quantity);
      expect(response.body.operation).toHaveProperty('totalValue');
    });

    test('GET /api/operations should list operations', async () => {
      if (shouldSkipDbTests()) {
        console.log('Pulando teste - banco de dados não disponível');
        return;
      }
      const response = await request(app)
        .get('/api/operations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('operations');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.operations)).toBe(true);
    });

    test('GET /api/operations/statistics should return statistics', async () => {
      if (shouldSkipDbTests()) {
        console.log('Pulando teste - banco de dados não disponível');
        return;
      }
      const response = await request(app)
        .get('/api/operations/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statistics');
      expect(response.body.statistics).toHaveProperty('totalOperations');
      expect(response.body.statistics).toHaveProperty('totalValue');
      expect(response.body.statistics).toHaveProperty('totalQuantity');
    });

    test('GET /api/operations/difference should return purchase/sale difference', async () => {
      if (shouldSkipDbTests()) {
        console.log('Pulando teste - banco de dados não disponível');
        return;
      }
      const response = await request(app)
        .get('/api/operations/difference')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('difference');
      expect(response.body.difference).toHaveProperty('totalPurchases');
      expect(response.body.difference).toHaveProperty('totalSales');
      expect(response.body.difference).toHaveProperty('difference');
      expect(response.body.difference).toHaveProperty('isPositive');
    });
  });

  describe('Protected Routes', () => {
    test('GET /api/operations should require authentication', async () => {
      if (shouldSkipDbTests()) {
        console.log('Pulando teste - banco de dados não disponível');
        return;
      }
      await request(app)
        .get('/api/operations')
        .expect(401);
    });

    test('POST /api/operations should require authentication', async () => {
      if (shouldSkipDbTests()) {
        console.log('Pulando teste - banco de dados não disponível');
        return;
      }
      await request(app)
        .post('/api/operations')
        .send({
          type: 'purchase',
          fuelType: 'gasoline',
          quantity: 100,
          month: 1
        })
        .expect(401);
    });
  });
});

