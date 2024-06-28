// backend/controllers/userController.js
const Sequelize = require('sequelize');
const User = require('../models/user');

// Função para criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const { nome, email, endereco, telefone, cpf, dataNascimento } = req.body;

    // Verificar se já existe um usuário com o mesmo nome, email, telefone ou CPF
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          { nome },
          { email },
          { telefone },
          { cpf }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Já existe um usuário com o mesmo nome, email, telefone ou CPF.' });
    }

    const newUser = await User.create({ nome, email, endereco, telefone, cpf, dataNascimento });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao criar usuário.' });
  }
};

// Função para obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar usuários.' });
  }
};

// Função para obter um usuário pelo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar usuário.' });
  }
};

// Função para atualizar um usuário pelo ID
exports.updateUser = async (req, res) => {
  try {
    const { nome, email, endereco, telefone, cpf, dataNascimento } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    await user.update({ nome, email, endereco, telefone, cpf, dataNascimento });
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar usuário.' });
  }
};

// Função para deletar um usuário pelo ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedRows = await User.destroy({ where: { id: userId } });
    if (deletedRows === 1) {
      return res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } else {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao deletar usuário.' });
  }
};
