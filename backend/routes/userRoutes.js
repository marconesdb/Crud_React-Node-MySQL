// backend/routes/userRoutes.js

// Importa o módulo express para criação de rotas
const express = require('express');
// Cria um novo router utilizando o express.Router()
const router = express.Router();
// Importa o controlador de usuário para lidar com as requisições
const userController = require('../controllers/userController');

// Definindo as rotas e associando os controladores

// Rota para criar um novo usuário (POST /)
router.post('/', userController.createUser);

// Rota para obter todos os usuários (GET /)
router.get('/', userController.getAllUsers);

// Rota para obter um usuário pelo ID (GET /:id)
router.get('/:id', userController.getUserById);

// Rota para atualizar um usuário pelo ID (PUT /:id)
router.put('/:id', userController.updateUser);

// Rota para deletar um usuário pelo ID (DELETE /:id)
router.delete('/:id', userController.deleteUser);

// Exporta o router para ser utilizado em outros arquivos da aplicação
module.exports = router;
