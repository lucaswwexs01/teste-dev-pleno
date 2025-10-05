const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fuel Tax API',
      version: '1.0.0',
      description: 'API para sistema de apuração de impostos de combustíveis',
      contact: {
        name: 'Lucas',
        email: 'lucas@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do usuário'
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuário'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Senha do usuário'
            }
          }
        },
        Operation: {
          type: 'object',
          required: ['type', 'fuelType', 'quantity', 'month'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da operação'
            },
            type: {
              type: 'string',
              enum: ['purchase', 'sale'],
              description: 'Tipo da operação (compra ou venda)'
            },
            fuelType: {
              type: 'string',
              enum: ['gasoline', 'ethanol', 'diesel'],
              description: 'Tipo do combustível'
            },
            quantity: {
              type: 'number',
              minimum: 0.01,
              description: 'Quantidade em litros'
            },
            month: {
              type: 'integer',
              minimum: 1,
              maximum: 12,
              description: 'Mês da operação'
            },
            year: {
              type: 'integer',
              description: 'Ano da operação'
            },
            unitPrice: {
              type: 'number',
              description: 'Preço unitário do combustível'
            },
            taxRate: {
              type: 'number',
              description: 'Taxa de tributo aplicada'
            },
            totalValue: {
              type: 'number',
              description: 'Valor total da operação'
            },
            userId: {
              type: 'integer',
              description: 'ID do usuário que realizou a operação'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            details: {
              type: 'string',
              description: 'Detalhes adicionais do erro'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};

