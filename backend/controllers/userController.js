// backend/controllers/userController.js

// Importa o Sequelize para realizar operações de consulta no banco de dados
const Sequelize = require('sequelize');
// Importa o modelo de usuário definido na aplicação
const User = require('../models/user');

// Função para criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    // Extrai os dados do corpo da requisição
    const { nome, email, endereco, telefone, cpf, dataNascimento } = req.body;

    // Verifica se já existe um usuário com o mesmo nome, email, telefone ou CPF
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

    // Se já existir um usuário com os mesmos dados, retorna um erro 400
    if (existingUser) {
      return res.status(400).json({ message: 'Já existe um usuário com o mesmo nome, email, telefone ou CPF.' });
    }

    // Cria um novo usuário no banco de dados
    const newUser = await User.create({ nome, email, endereco, telefone, cpf, dataNascimento });

    // Retorna o novo usuário criado com status 201 (Criado)
    return res.status(201).json(newUser);
  } catch (error) {
    // Se ocorrer algum erro durante a criação do usuário, retorna um erro 500 (Erro interno)
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao criar usuário.' });
  }
};

// Função para obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    // Busca todos os usuários no banco de dados
    const users = await User.findAll();

    // Retorna a lista de usuários encontrados com status 200 (OK)
    return res.status(200).json(users);
  } catch (error) {
    // Se ocorrer um erro durante a busca de usuários, retorna um erro 500 (Erro interno)
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar usuários.' });
  }
};

// Função para obter um usuário pelo ID
exports.getUserById = async (req, res) => {
  try {
    // Busca um usuário pelo ID fornecido na requisição
    const user = await User.findByPk(req.params.id);

    // Se não encontrar um usuário com o ID especificado, retorna um erro 404 (Não encontrado)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Retorna o usuário encontrado com status 200 (OK)
    return res.status(200).json(user);
  } catch (error) {
    // Se ocorrer um erro durante a busca do usuário, retorna um erro 500 (Erro interno)
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar usuário.' });
  }
};

// Função para atualizar um usuário pelo ID
exports.updateUser = async (req, res) => {
  try {
    // Extrai os dados do corpo da requisição
    const { nome, email, endereco, telefone, cpf, dataNascimento } = req.body;

    // Busca um usuário pelo ID fornecido na requisição
    const user = await User.findByPk(req.params.id);

    // Se não encontrar um usuário com o ID especificado, retorna um erro 404 (Não encontrado)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza os dados do usuário encontrado
    await user.update({ nome, email, endereco, telefone, cpf, dataNascimento });

    // Retorna o usuário atualizado com status 200 (OK)
    return res.status(200).json(user);
  } catch (error) {
    // Se ocorrer um erro durante a atualização do usuário, retorna um erro 500 (Erro interno)
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar usuário.' });
  }
};

// Função para deletar um usuário pelo ID
exports.deleteUser = async (req, res) => {
  try {
    // Extrai o ID do usuário a ser deletado da requisição
    const userId = req.params.id;

    // Deleta o usuário no banco de dados baseado no ID fornecido
    const deletedRows = await User.destroy({ where: { id: userId } });

    // Se o número de linhas deletadas for 1, significa que o usuário foi deletado com sucesso
    if (deletedRows === 1) {
      return res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } else {
      // Se não encontrar um usuário com o ID especificado, retorna um erro 404 (Não encontrado)
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
  } catch (error) {
    // Se ocorrer um erro durante a exclusão do usuário, retorna um erro 500 (Erro interno)
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao deletar usuário.' });
  }
};
