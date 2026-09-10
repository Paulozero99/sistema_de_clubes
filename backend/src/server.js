// server.js
//
// Responsabilidade: criar a aplicação Express, ligar os
// middlewares globais (cors, JSON) e "plugar" as rotas.
// Este arquivo NÃO contém SQL nem regras de negócio — ele só
// monta a aplicação.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clubesRoutes from './routes/clubes.routes.js';

dotenv.config();

const app = express();

app.use(cors());          // permite que o frontend (outra porta) acesse a API
app.use(express.json());  // permite ler JSON enviado no corpo das requisições (req.body)

// Rota simples só para confirmar que a API está no ar
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Sistema de Clubes do IFMS está funcionando.' });
});

// Todas as rotas de clube ficam sob o prefixo /api/clubes
app.use('/api/clubes', clubesRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
