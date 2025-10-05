const authService = require('../services/auth.service');
const { asyncHandler } = require('../middlewares/error.middleware');
const logger = require('../config/logger');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Senha do usuário
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já está em uso
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await authService.register({ name, email, password });

  res.status(201).json({
    message: 'Usuário registrado com sucesso',
    user: result.user,
    token: result.token
  });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *       401:
 *         description: Credenciais inválidas
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  res.json({
    message: 'Login realizado com sucesso',
    user: result.user,
    token: result.token
  });
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtém dados do perfil do usuário autenticado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou expirado
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);

  res.json({
    message: 'Perfil obtido com sucesso',
    user
  });
});

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Atualiza dados do perfil do usuário autenticado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Nova senha do usuário
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já está em uso
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  const updatedUser = await authService.updateProfile(userId, { name, email, password });

  res.json({
    message: 'Perfil atualizado com sucesso',
    user: updatedUser
  });
});

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Lista todos os usuários (apenas para administradores)
 *     tags: [Authentication]
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
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
const listUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await authService.listUsers({ page, limit });

  res.json({
    message: 'Usuários listados com sucesso',
    ...result
  });
});

/**
 * @swagger
 * /api/auth/users/{id}:
 *   get:
 *     summary: Obtém dados de um usuário específico
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await authService.getUserById(id);

  res.json({
    message: 'Usuário encontrado',
    user
  });
});

/**
 * @swagger
 * /api/auth/users/{id}/deactivate:
 *   patch:
 *     summary: Desativa um usuário
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário desativado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await authService.deactivateUser(id);

  res.json({
    message: 'Usuário desativado com sucesso'
  });
});

/**
 * @swagger
 * /api/auth/users/{id}/activate:
 *   patch:
 *     summary: Reativa um usuário
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário reativado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
const activateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await authService.activateUser(id);

  res.json({
    message: 'Usuário reativado com sucesso'
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  listUsers,
  getUserById,
  deactivateUser,
  activateUser
};

