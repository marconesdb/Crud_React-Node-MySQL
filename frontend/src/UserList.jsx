import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/api/events'); // Rota SSE do seu servidor Express

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
      eventSource.close(); // Fecha a conexão SSE ao desmontar o componente
    };
  }, []);

  return (
    <div className="p-4 bg-orange-500">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>
      <ul className="divide-y divide-gray-500">
        {users.map((user) => (
          <li key={user.id} className="py-4">
            <p className="font-bold">{user.nome}</p>
            <p>{user.email}</p>
            <p>{user.telefone}</p>
            <p>{user.cpf}</p>
            <p>{user.dataNascimento}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

