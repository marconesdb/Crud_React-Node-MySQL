import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '',
    endereco: '',
    telefone: '',
    cpf: '',
    dataNascimento: ''
  });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/api/events');

    eventSource.onmessage = (event) => {
      const updatedUsers = JSON.parse(event.data);
      setUsers(updatedUsers);
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSearch = async () => {
    try {
      let response;
      if (!isNaN(searchTerm) && searchTerm.trim() !== '') {
        response = await axios.get(`http://localhost:3000/api/users/${encodeURIComponent(searchTerm)}`);
      } else {
        response = await axios.get(`http://localhost:3000/api/users?search=${encodeURIComponent(searchTerm)}`);
      }
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };
  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChangeNewUser = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

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
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

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
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const userListToRender = searchTerm.trim() === '' ? users : searchResults;

  return (
    <div className="p-4 bg-slate-800">
      <div className="mt-4 bg-neutral-500 p-4">
        <h2 className="text-xl font-bold mb-2">Adicionar Novo Usuário</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1">Nome:</label>
              <input
                type="text"
                name="nome"
                value={newUser.nome}
                onChange={handleInputChangeNewUser}
                className="px-4 py-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChangeNewUser}
                className="px-4 py-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1">Endereço:</label>
              <input
                type="text"
                name="endereco"
                value={newUser.endereco}
                onChange={handleInputChangeNewUser}
                className="px-4 py-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1">Telefone:</label>
              <input
                type="text"
                name="telefone"
                value={newUser.telefone}
                onChange={handleInputChangeNewUser}
                className="px-4 py-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <label className="block mb-1">CPF:</label>
              <input
                type="text"
                name="cpf"
                value={newUser.cpf}
                onChange={handleInputChangeNewUser}
                className="px-4 py-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
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
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Cadastrar Usuário
          </button>
        </form>
      </div>


      <div className="mb-4 mt-4 flex items-center">
  
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded mr-2"
          placeholder="Pesquisar por nome ou ID"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSearch}
        >
          Pesquisar
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-lime-500 ">Lista de Usuários</h1>



      <ul className="divide-y text-slate-500 divide-gray-500">
        {userListToRender.map((user) => (
          <li key={user.id} className="py-4 bg-slate-300 px-4">
            <p className="font-bold text-lg">{user.nome}</p>
            <p><strong><em>Email:</em></strong> {user.email}</p>
            <p><strong><em>Telefone:</em> </strong>{user.telefone}</p>
            <p><strong><em>CPF:</em></strong> {user.cpf}</p>
            <p><strong><em>Data de Nascimento:</em></strong> {user.dataNascimento}</p>
            <div className="flex mt-2">
              {editingUserId === user.id ? (
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="flex flex-wrap -mx-2">
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                      <label className="block mb-1">Nome:</label>
                      <input
                        type="text"
                        name="nome"
                        value={newUser.nome}
                        onChange={handleInputChangeNewUser}
                        className="px-4 py-2 border border-gray-300 rounded w-full"
                        required
                      />
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                      <label className="block mb-1">Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChangeNewUser}
                        className="px-4 py-2 border border-gray-300 rounded w-full"
                        required
                      />
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                      <label className="block mb-1">Endereço:</label>
                      <input
                        type="text"
                        name="endereco"
                        value={newUser.endereco}
                        onChange={handleInputChangeNewUser}
                        className="px-4 py-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                      <label className="block mb-1">Telefone:</label>
                      <input
                        type="text"
                        name="telefone"
                        value={newUser.telefone}
                        onChange={handleInputChangeNewUser}
                        className="px-4 py-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                      <label className="block mb-1">CPF:</label>
                      <input
                        type="text"
                        name="cpf"
                        value={newUser.cpf}
                        onChange={handleInputChangeNewUser}
                        className="px-4 py-2 border border-gray-300 rounded w-full"
                        required
                      />
                    </div>
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
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Atualizar Usuário
                  </button>
                </form>
              ) : (
                <div className="ml-auto">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-blue-500 cursor-pointer mr-4"
                    onClick={() => handleEditUser(user.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteUser(user.id)}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
