// backend/config/database.js

// Importa o módulo Sequelize do pacote 'sequelize'
const { Sequelize } = require('sequelize');

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Cria uma instância do Sequelize, que representa a conexão com o banco de dados
const sequelize = new Sequelize(
  // Utiliza variáveis de ambiente para configurar o nome do banco de dados
  process.env.DB_NAME,      // Nome do banco de dados
  process.env.DB_USER,      // Usuário do banco de dados
  process.env.DB_PASSWORD,  // Senha do banco de dados
  {
    // Configurações adicionais do Sequelize, usando variáveis de ambiente
    host: process.env.DB_HOST,  // Host do banco de dados
    dialect: 'mysql',           // Dialeto do banco de dados (MySQL neste caso)
  }
);

// Exporta a instância do Sequelize configurada, para que possa ser utilizada em outros arquivos
module.exports = sequelize;
