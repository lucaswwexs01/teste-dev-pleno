const operationService = require('../services/operation.service');
const { asyncHandler } = require('../middlewares/error.middleware');
const logger = require('../config/logger');

/**
 * @swagger
 * /api/operations:
 *   post:
 *     summary: Cria uma nova operação
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 */
const createOperation = asyncHandler(async (req, res) => {
  const operationData = req.body;
  const userId = req.user.id;

  const validation = operationService.validateOperationData(operationData);
  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: validation.errors
    });
  }

  const operation = await operationService.createOperation(operationData, userId);

  res.status(201).json({
    message: 'Operação criada com sucesso',
    operation
  });
});

/**
 * @swagger
 * /api/operations:
 *   get:
 *     summary: Lista operações
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Limite de itens por página
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filtrar por mês
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtrar por ano
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [purchase, sale]
 *         description: Filtrar por tipo de operação
 *       - in: query
 *         name: fuelType
 *         schema:
 *           type: string
 *           enum: [gasoline, ethanol, diesel]
 *         description: Filtrar por tipo de combustível
 *     responses:
 *       200:
 *         description: Lista de operações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Operation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
const listOperations = asyncHandler(async (req, res) => {
  const filters = req.query;
  const userId = req.user.id;

  const result = await operationService.listOperations(filters, userId);

  res.json({
    message: 'Operações listadas com sucesso',
    ...result
  });
});

/**
 * @swagger
 * /api/operations/{id}:
 *   get:
 *     summary: Obtém uma operação específica
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da operação
 *     responses:
 *       200:
 *         description: Operação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 *       404:
 *         description: Operação não encontrada
 *       403:
 *         description: Acesso negado
 */
const getOperationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const operation = await operationService.getOperationById(id, userId);

  res.json({
    message: 'Operação encontrada',
    operation
  });
});

/**
 * @swagger
 * /api/operations/{id}:
 *   put:
 *     summary: Atualiza uma operação
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da operação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [purchase, sale]
 *                 description: Tipo da operação
 *               fuelType:
 *                 type: string
 *                 enum: [gasoline, ethanol, diesel]
 *                 description: Tipo do combustível
 *               quantity:
 *                 type: number
 *                 minimum: 0.001
 *                 description: Quantidade em litros
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 description: Mês da operação
 *               year:
 *                 type: integer
 *                 description: Ano da operação
 *     responses:
 *       200:
 *         description: Operação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Operação não encontrada
 *       403:
 *         description: Acesso negado
 */
const updateOperation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user.id;

  const operation = await operationService.updateOperation(id, updateData, userId);

  res.json({
    message: 'Operação atualizada com sucesso',
    operation
  });
});

/**
 * @swagger
 * /api/operations/{id}:
 *   delete:
 *     summary: Remove uma operação
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da operação
 *     responses:
 *       200:
 *         description: Operação removida com sucesso
 *       404:
 *         description: Operação não encontrada
 *       403:
 *         description: Acesso negado
 */
const deleteOperation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await operationService.deleteOperation(id, userId);

  res.json({
    message: 'Operação removida com sucesso'
  });
});

/**
 * @swagger
 * /api/operations/statistics:
 *   get:
 *     summary: Obtém estatísticas das operações
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filtrar por mês
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtrar por ano
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [purchase, sale]
 *         description: Filtrar por tipo de operação
 *       - in: query
 *         name: fuelType
 *         schema:
 *           type: string
 *           enum: [gasoline, ethanol, diesel]
 *         description: Filtrar por tipo de combustível
 *     responses:
 *       200:
 *         description: Estatísticas das operações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOperations:
 *                   type: integer
 *                 totalValue:
 *                   type: number
 *                 totalQuantity:
 *                   type: number
 *                 byType:
 *                   type: object
 *                   properties:
 *                     purchase:
 *                       type: number
 *                     sale:
 *                       type: number
 *                 byFuelType:
 *                   type: object
 *                   properties:
 *                     gasoline:
 *                       type: number
 *                     ethanol:
 *                       type: number
 *                     diesel:
 *                       type: number
 *                 byMonth:
 *                   type: object
 *                 averageValue:
 *                   type: number
 *                 averageQuantity:
 *                   type: number
 */
const getStatistics = asyncHandler(async (req, res) => {
  const filters = req.query;
  const userId = req.user.id;

  const statistics = await operationService.getStatistics(filters, userId);

  res.json({
    message: 'Estatísticas obtidas com sucesso',
    statistics
  });
});

/**
 * @swagger
 * /api/operations/difference:
 *   get:
 *     summary: Calcula diferença entre compras e vendas
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filtrar por mês
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtrar por ano
 *       - in: query
 *         name: fuelType
 *         schema:
 *           type: string
 *           enum: [gasoline, ethanol, diesel]
 *         description: Filtrar por tipo de combustível
 *     responses:
 *       200:
 *         description: Diferença entre compras e vendas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPurchases:
 *                   type: number
 *                 totalSales:
 *                   type: number
 *                 difference:
 *                   type: number
 *                 isPositive:
 *                   type: boolean
 *                 operationsCount:
 *                   type: integer
 */
const getPurchaseSaleDifference = asyncHandler(async (req, res) => {
  const filters = req.query;
  const userId = req.user.id;

  const difference = await operationService.calculatePurchaseSaleDifference(filters, userId);

  res.json({
    message: 'Diferença calculada com sucesso',
    difference
  });
});

/**
 * @swagger
 * /api/operations/report:
 *   get:
 *     summary: Gera relatório completo das operações
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Limite de itens por página
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filtrar por mês
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtrar por ano
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [purchase, sale]
 *         description: Filtrar por tipo de operação
 *       - in: query
 *         name: fuelType
 *         schema:
 *           type: string
 *           enum: [gasoline, ethanol, diesel]
 *         description: Filtrar por tipo de combustível
 *     responses:
 *       200:
 *         description: Relatório completo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Operation'
 *                 pagination:
 *                   type: object
 *                 statistics:
 *                   type: object
 *                 purchaseSaleDifference:
 *                   type: object
 *                 filters:
 *                   type: object
 *                 generatedAt:
 *                   type: string
 *                   format: date-time
 */
const generateReport = asyncHandler(async (req, res) => {
  const filters = req.query;
  const userId = req.user.id;

  const report = await operationService.generateReport(filters, userId);

  res.json({
    message: 'Relatório gerado com sucesso',
    ...report
  });
});

/**
 * @swagger
 * /api/operations/preview:
 *   post:
 *     summary: Calcula preview de uma operação
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 */
const calculatePreview = asyncHandler(async (req, res) => {
  const { type, fuelType, quantity, month, year = 2024 } = req.body;

  const preview = await operationService.calculatePreview({
    type,
    fuelType,
    quantity: parseFloat(quantity),
    month,
    year
  });

  res.json({
    message: 'Preview calculado com sucesso',
    data: preview
  });
});

module.exports = {
  createOperation,
  listOperations,
  getOperationById,
  updateOperation,
  deleteOperation,
  getStatistics,
  getPurchaseSaleDifference,
  generateReport,
  calculatePreview
};

