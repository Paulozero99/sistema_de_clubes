// main.jsx
//
// Responsabilidade: "pendurar" o componente <App /> na página
// HTML (na div#root). É o ponto de entrada da aplicação React.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
