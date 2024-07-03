//backend/app.js 

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use(bodyParser.json()); // Middleware para fazer parsing de JSON nas requisições
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para fazer parsing de dados codificados nas requisições

// Rotas
app.use('/api/users', userRoutes); // Utiliza as rotas definidas em userRoutes para endpoints relacionados aos usuários

// Rota para SSE (Server-Sent Events) - emitir eventos para o frontend
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream'); // Define o tipo de conteúdo como eventos SSE
  res.setHeader('Cache-Control', 'no-cache'); // Indica que não deve ser feito cache da resposta
  res.setHeader('Connection', 'keep-alive'); // Mantém a conexão aberta para enviar eventos continuamente

  // Função para enviar eventos SSE
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`); // Formata o evento SSE como uma string JSON e envia
  };

  // Exemplo: emitir um evento SSE quando um usuário for adicionado, editado ou deletado
  const emitUserEvent = (userData) => {
    sendEvent(userData); // Chama a função sendEvent para enviar o evento SSE com os dados do usuário
  };

  // Registra o listener de eventos SSE
  // Não é mais necessário registrar um listener do EventEmitter aqui, pois não estamos mais utilizando EventEmitter

  // Remove o listener quando a conexão SSE é encerrada
  req.on('close', () => {
    // Não é mais necessário remover o listener do EventEmitter aqui
    res.end(); // Encerra a resposta
  });
});

// Verifica a conexão com o banco de dados e inicia o servidor
sequelize
  .authenticate() // Tenta autenticar a conexão com o banco de dados
  .then(() => {
    console.log('Conexão estabelecida com sucesso.'); // Exibe mensagem de sucesso ao conectar ao banco de dados

    // Inicia o servidor express na porta especificada (ou na porta 3000 se não especificada)
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`); // Exibe mensagem indicando que o servidor está rodando
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err); // Exibe erro se não conseguir conectar ao banco de dados
  });
