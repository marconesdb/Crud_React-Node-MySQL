import React from 'react'
import ReactDOM from 'react-dom/client'
import UserList from './UserList.jsx'
import 'tailwindcss/tailwind.css'; // Exemplo para Tailwind CSS


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserList/>
  </React.StrictMode>,
)
