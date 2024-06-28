// backend/models/user.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  endereco: {
    type: DataTypes.STRING,
  },
  telefone: {
    type: DataTypes.STRING,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
  },
});

// Cria a tabela no banco de dados, se ainda não existir
User.sync({ alter: true })
  .then(() => {
    console.log('Tabela de usuários criada com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabela:', err);
  });

module.exports = User;
