## Projeto CRUD

## Comandos do Backend


Este é o backend do projeto CRUD, uma aplicação simples para gerenciar usuários utilizando Node.js, Express.js e Sequelize com MySQL.

## Requisitos

- Instalação de Node.js (versão 12 ou superior)
- Instalação do MySQL (ou outro banco de dados suportado pelo Sequelize)
- Instalação do pacote npm

## Instalação

1. **Clonar o repositório:**

   ```bash
   git clone https://github.com/marconesdb/Crud_React-Node-MySQL.git
   cd backend
   ```

2. **Instalar as dependências:**

   Utilize npm (Node Package Manager):

   ```bash
   npm init -y;  
   npm install express mysql2 sequelize dotenv cors;
   npm install --save-dev nodemon;
   npm install axios body-parser 
   ```

3. **Configuração do banco de dados:**

   - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` fornecido.
   - Configure as variáveis de ambiente necessárias (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT) com as informações do seu banco de dados MySQL.

4. **Crie um Banco de dados:**
   - Crie um banco de dados MySQL com um nome qualquer. Ex: `crud_react_node_mysql`.

5. **Iniciar o servidor:**

   Para iniciar o servidor Express:

   ```bash
   npm start
   ```

6. **Acessar as rotas da API:**

   O backend estará disponível em `http://localhost:3000`.

   - `POST http://localhost:3000/api/users`: Criar um novo usuário.
   - `GET http://localhost:3000/api/users`: Obter todos os usuários.
   - `GET http://localhost:3000/api/users/:id`: Obter um usuário pelo ID.
   - `PUT http://localhost:3000/api/users/:id`: Atualizar um usuário pelo ID.
   - `DELETE http://localhost:3000/api/users/:id`: Deletar um usuário pelo ID.
   - `GET http://localhost:3000/api/events`: Rota para eventos SSE (Server-Sent Events).

---

## Comandos do FRONTEND

### Criar o projeto React com Vite

```bash
npm create vite@latest frontend -- --template react
```

### Instalar dependências

```bash
cd frontend
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
npm install -D eslint eslint-plugin-react eslint-config-airbnb
npm install axios
npm install react-icons --save
npm install react-modal
npm install react-input-mask@next
```

### Executar o projeto frontend

```bash
npm run dev
```

---

© 2024 Marcone Silva de Brito. Licenciado sob a Licença MIT.

---

