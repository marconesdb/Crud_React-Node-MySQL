// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { EventEmitter } = require('events'); // Importa EventEmitter para emitir eventos SSE
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const eventEmitter = new EventEmitter(); // Cria uma instância de EventEmitter para emitir eventos
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/api/users', userRoutes);

// Rota para SSE (emitir eventos para o frontend)
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Função para enviar eventos SSE
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Registra o listener de eventos SSE
  eventEmitter.on('userUpdate', sendEvent);

  // Remove o listener quando a conexão SSE é encerrada
  req.on('close', () => {
    eventEmitter.off('userUpdate', sendEvent);
    res.end();
  });
});

// Exemplo: emitir um evento SSE quando um usuário for adicionado, editado ou deletado
const emitUserEvent = (userData) => {
  eventEmitter.emit('userUpdate', userData);
};

// Verifica a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
