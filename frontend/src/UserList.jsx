import { useEffect, useState } from 'react';
import axios from 'axios';
import MaskedInput from 'react-text-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const UserList = () => {
  // State para armazenar a lista de usuários, termo de pesquisa, usuários filtrados, novo usuário, etc.
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '',
    endereco: '',
    telefone: '',
    cpf: '',
    dataNascimento: ''
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [userMessages, setUserMessages] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Efeito para buscar os usuários ao montar o componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  // Efeito para filtrar usuários com base no termo de pesquisa
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filteredData = users.filter(user => {
        return Object.keys(user).some(key =>
          user[key].toString().toLowerCase().includes(lowercasedFilter)
        );
      });
      setFilteredUsers(filteredData);
    }
  }, [searchTerm, users]);

  // Handler para atualizar o termo de pesquisa
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler para atualizar o estado do novo usuário durante a entrada de dados
  const handleInputChangeNewUser = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handler para adicionar um novo usuário
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/users', newUser);
      setNewUser({
        nome: '',
        email: '',
        endereco: '',
        telefone: '',
        cpf: '',
        dataNascimento: ''
      });
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setConfirmationMessage('Usuário cadastrado com sucesso.');
      setErrorMessage('');
      setTimeout(() => {
        setConfirmationMessage('');
      }, 10000); // Limpa a mensagem de confirmação após 10 segundos
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('Usuário já cadastrado com este email, telefone, CPF ou nome.');
      } else {
        setErrorMessage('Erro ao cadastrar usuário.');
      }
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  // Handler para deletar um usuário
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setUserMessages(prevMessages => ({
        ...prevMessages,
        [userId]: 'Usuário excluído com sucesso.'
      }));
      setTimeout(() => {
        setUserMessages(prevMessages => ({
          ...prevMessages,
          [userId]: ''
        }));
      }, 10000); // Limpa a mensagem de usuário após 10 segundos
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  // Handler para editar um usuário
  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setNewUser({
        nome: userToEdit.nome,
        email: userToEdit.email,
        endereco: userToEdit.endereco || '',
        telefone: userToEdit.telefone || '',
        cpf: userToEdit.cpf,
        dataNascimento: userToEdit.dataNascimento || ''
      });
    }
  };

  // Handler para atualizar um usuário
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/users/${editingUserId}`, newUser);
      setEditingUserId(null);
      setNewUser({
        nome: '',
        email: '',
        endereco: '',
        telefone: '',
        cpf: '',
        dataNascimento: ''
      });
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setUserMessages(prevMessages => ({
        ...prevMessages,
        [editingUserId]: 'Usuário atualizado com sucesso.'
      }));
      setTimeout(() => {
        setUserMessages(prevMessages => ({
          ...prevMessages,
          [editingUserId]: ''
        }));
      }, 10000); // Limpa a mensagem de usuário após 10 segundos
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  // Handler para abrir o modal de confirmação de exclusão
  const openModal = (user) => {
    setUserToDelete(user);
    setModalIsOpen(true);
  };

  // Handler para fechar o modal de confirmação de exclusão
  const closeModal = () => {
    setModalIsOpen(false);
    setUserToDelete(null);
  };

  // Handler para confirmar a exclusão de um usuário
  const confirmDeleteUser = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id);
      closeModal();
    }
  };

  return (
    <div className="p-4 bg-slate-800">
      <div className="mt-4 bg-neutral-500 p-4">
        <h2 className="text-xl font-bold mb-2">Adicionar Novo Usuário</h2>
        {/* Mensagem de erro ao cadastrar usuário */}
        {errorMessage && (
          <div className="mb-4 text-red-500 font-bold">
            {errorMessage}
          </div>
        )}
        {/* Mensagem de confirmação ao cadastrar usuário */}
        {confirmationMessage && (
          <div className="mb-4 text-yellow-400 font-bold">
            {confirmationMessage}
          </div>
        )}
        {/* Formulário para adicionar novo usuário */}
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="flex flex-wrap -mx-2">
            {/* Input para nome */}
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1 font-bold">Nome:</label>
              <input
                type="text"
                name="nome"
                value={newUser.nome}
                onChange={handleInputChangeNewUser}
                className="px-4 py-2 border border-gray-300 rounded w-full"
                placeholder="Digite o nome"
                required
              />
            </div>
            {/* Input para email */}
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1 font-bold">Email:</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChangeNewUser}
                className="px-4 py-2 border border-gray-300 rounded w-full"
                placeholder="Digite o email"
                required
              />
            </div>
            {/* Input para endereço */}
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1 font-bold">Endereço:</label>
              <input
                type="text"
                name="endereco"
                value={newUser.endereco}
                onChange={handleInputChangeNewUser}
                className="px-4 py-2 border border-gray-300 rounded w-full"
                placeholder="Digite o endereço"
              />
            </div>
            {/* Input para telefone com máscara */}
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1 font-bold">Telefone:</label>
              <MaskedInput
                mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className="px-4 py-2 border border-gray-300 rounded w-full"
                placeholder="Digite o telefone"
                value={newUser.telefone}
                name="telefone"
                onChange={handleInputChangeNewUser}
              />
            </div>
            {/* Input para CPF com máscara */}
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1 font-bold">CPF:</label>
              <MaskedInput
                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                className="px-4 py-2 border border-gray-300 rounded w-full"
                placeholder="Digite o CPF"
                value={newUser.cpf}
                name="cpf"
                onChange={handleInputChangeNewUser}
                required
              />
            </div>
            {/* Input para data de nascimento */}
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1 font-bold">Data de Nascimento:</label>
              <input
                type="date"
                name="dataNascimento"
                value={newUser.dataNascimento}
                onChange={handleInputChangeNewUser}
                className="px-4 py-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>
          {/* Botão para cadastrar usuário */}
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Cadastrar Usuário
          </button>
        </form>
      </div>

      {/* Input para buscar usuários */}
      <div className="mb-4 mt-4 flex items-center">
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded mr-2 w-full max-w-md"
          placeholder="Pesquisar por nome do usuário"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>

      {/* Título para lista de usuários */}
      <h1 className="text-2xl font-bold mb-4 text-lime-500">Lista de Usuários</h1>

      {/* Lista de usuários */}
      <ul className="divide-y text-slate-500 divide-gray-500">
        {/* Exibe mensagem se nenhum usuário for encontrado */}
        {filteredUsers.length === 0 ? (
          <li className="py-4 bg-slate-300 px-4 text-center">Nenhum usuário encontrado.</li>
        ) : (
          // Mapeia e exibe cada usuário encontrado
          filteredUsers.map((user) => (
            <li key={user.id} className="py-4 bg-slate-300 px-4">
              <p className="font-bold text-lg text-black">{user.nome}</p>
              <p><strong><em>Endereço:</em></strong> {user.endereco}</p>
              <p><strong><em>Email:</em></strong> {user.email}</p>
              <p><strong><em>Telefone:</em> </strong>{user.telefone}</p>
              <p><strong><em>CPF:</em></strong> {user.cpf}</p>
              <p><strong><em>Data de Nascimento:</em></strong> {user.dataNascimento}</p>
              {/* Exibe mensagem de usuário específico, se houver */}
              {userMessages[user.id] && (
                <div className="mb-4 text-sky-700 font-bold">
                  {userMessages[user.id]}
                </div>
              )}
              <div className="flex mt-2">
                {/* Formulário de edição de usuário */}
                {editingUserId === user.id ? (
                  <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div className="flex flex-wrap -mx-2">
                      {/* Input para nome (editável) */}
                      <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <label className="block mb-1">Nome:</label>
                        <input
                          type="text"
                          name="nome"
                          value={newUser.nome}
                          onChange={handleInputChangeNewUser}
                          className="px-4 py-2 border border-gray-300 rounded w-full"
                          placeholder="Digite o nome"
                          required
                        />
                      </div>
                      {/* Input para email (editável) */}
                      <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <label className="block mb-1">Email:</label>
                        <input
                          type="email"
                          name="email"
                          value={newUser.email}
                          onChange={handleInputChangeNewUser}
                          className="px-4 py-2 border border-gray-300 rounded w-full"
                          placeholder="Digite o email"
                          required
                        />
                      </div>
                      {/* Input para endereço (editável) */}
                      <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <label className="block mb-1">Endereço:</label>
                        <input
                          type="text"
                          name="endereco"
                          value={newUser.endereco}
                          onChange={handleInputChangeNewUser}
                          className="px-4 py-2 border border-gray-300 rounded w-full"
                          placeholder="Digite o endereço"
                        />
                      </div>
                      {/* Input para telefone com máscara (editável) */}
                      <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <label className="block mb-1">Telefone:</label>
                        <MaskedInput
                          mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                          className="px-4 py-2 border border-gray-300 rounded w-full"
                          placeholder="Digite o telefone"
                          value={newUser.telefone}
                          name="telefone"
                          onChange={handleInputChangeNewUser}
                        />
                      </div>
                      {/* Input para CPF com máscara (editável) */}
                      <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <label className="block mb-1">CPF:</label>
                        <MaskedInput
                          mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                          className="px-4 py-2 border border-gray-300 rounded w-full"
                          placeholder="Digite o CPF"
                          value={newUser.cpf}
                          name="cpf"
                          onChange={handleInputChangeNewUser}
                          required
                        />
                      </div>
                      {/* Input para data de nascimento (editável) */}
                      <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <label className="block mb-1">Data de Nascimento:</label>
                        <input
                          type="date"
                          name="dataNascimento"
                          value={newUser.dataNascimento}
                          onChange={handleInputChangeNewUser}
                          className="px-4 py-2 border border-gray-300 rounded w-full"
                        />
                      </div>
                    </div>
                    {/* Botão para atualizar usuário */}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Atualizar Usuário
                    </button>
                  </form>
                ) : (
                  // Ícones para editar e excluir usuário
                  <div className="ml-auto">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-blue-500 cursor-pointer mr-4"
                      onClick={() => handleEditUser(user.id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="text-red-500 cursor-pointer"
                      onClick={() => openModal(user)}
                    />
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Modal para confirmar exclusão */}
      {modalIsOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-lg font-bold mb-4">Confirmar Exclusão</p>
            <p>Tem certeza que deseja excluir o usuário {userToDelete.nome}?</p>
            <div className="mt-4 flex justify-end">
              {/* Botão para excluir usuário */}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                onClick={confirmDeleteUser}
              >
                Excluir
              </button>
              {/* Botão para cancelar exclusão */}
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
