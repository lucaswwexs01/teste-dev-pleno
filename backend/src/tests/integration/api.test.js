const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/database/models');

describe('API Tests', () => {
  beforeAll(async () => {
    // Conectar ao banco de dados de teste
    await sequelize.authenticate();
  });

  afterAll(async () => {
    // Fechar conexão com o banco de dados
    await sequelize.close();
  });

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
      // Fazer login para obter token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123'
        });

      authToken = loginResponse.body.token;
      userId = loginResponse.body.user.id;
    });

    test('POST /api/operations should create a new operation', async () => {
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
      await request(app)
        .get('/api/operations')
        .expect(401);
    });

    test('POST /api/operations should require authentication', async () => {
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

