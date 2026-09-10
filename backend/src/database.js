// database.js
//
// Responsabilidade: criar e exportar o "pool" de conexões com o
// MySQL. Um pool é um conjunto de conexões prontas para uso,
// reaproveitadas entre as requisições — assim não abrimos e
// fechamos uma conexão nova a cada consulta.
//
// Nenhum outro arquivo do projeto deve se conectar diretamente
// ao MySQL: todos usam este pool.

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // no máximo 10 conexões simultâneas
});

export default pool;
