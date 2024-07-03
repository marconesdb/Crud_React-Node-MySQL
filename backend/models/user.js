// backend/models/user.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define o modelo de dados para a tabela 'User' usando o Sequelize
const User = sequelize.define('User', {
  // Campo 'nome' do tipo STRING, não pode ser nulo
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Campo 'email' do tipo STRING, não pode ser nulo, deve ser único e válido (formato de e-mail)
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  // Campo 'endereco' do tipo STRING, pode ser nulo
  endereco: {
    type: DataTypes.STRING,
  },
  // Campo 'telefone' do tipo STRING, pode ser nulo
  telefone: {
    type: DataTypes.STRING,
  },
  // Campo 'cpf' do tipo STRING, não pode ser nulo e deve ser único
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Campo 'dataNascimento' do tipo DATEONLY (apenas data sem hora), pode ser nulo
  dataNascimento: {
    type: DataTypes.DATEONLY,
  },
});

// Sincroniza o modelo com o banco de dados e cria a tabela se ainda não existir
User.sync({ alter: true })
  .then(() => {
    console.log('Tabela de usuários criada com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabela:', err);
  });

module.exports = User; // Exporta o modelo 'User' para ser utilizado em outras partes do aplicativo
