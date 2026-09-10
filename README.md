# Sistema de Gerenciamento de Clubes — IFMS Campus Nova Andradina

**Fase 1 — Base funcional: CRUD de clubes**

Este projeto é a primeira fase de um sistema web para gerenciar os
clubes estudantis do IFMS Campus Nova Andradina. Nesta fase **não**
há login, autorização, upload real de imagens ou deploy — o
objetivo é ter uma base organizada, funcionando 100% em ambiente
local, para depois evoluir.

## Estrutura do projeto

```
sistema-clubes/
├── backend/                 API REST (Node + Express + mysql2)
│   ├── src/
│   │   ├── server.js
│   │   ├── database.js
│   │   ├── routes/
│   │   └── controllers/
│   ├── .env.example
│   └── package.json
├── frontend/                Interface (React + Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
└── database/
    └── database.sql         cria o banco, tabelas e dados de teste
```

---

## 1. Requisitos

Antes de começar, tenha instalado na sua máquina:

- **Node.js** 18 ou superior ([nodejs.org](https://nodejs.org))
- **MySQL** 8 (ou compatível), instalado e rodando localmente
- Um cliente para rodar scripts SQL — MySQL Workbench, DBeaver, ou o
  próprio terminal com o comando `mysql`

## 2. Instalação passo a passo

### 2.1. Baixe/extraia o projeto

Extraia o `.zip` em uma pasta qualquer da sua máquina. A partir daqui,
todos os comandos assumem que você está dentro da pasta
`sistema-clubes/`.

### 2.2. Crie o banco de dados

Execute o arquivo `database/database.sql` no seu MySQL. Ele cria o
banco `clubes_ifms`, todas as tabelas e já insere alguns dados de
teste (usuários, clubes, membros, atividades e solicitações).

Pela linha de comando:

```bash
mysql -u root -p < database/database.sql
```

Ou abra o arquivo no MySQL Workbench/DBeaver e execute o script
inteiro.

### 2.3. Configure e inicie o backend

```bash
cd backend
npm install
cp .env.example .env
```

Abra o arquivo `.env` recém-criado e ajuste os dados do seu MySQL
local:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=clubes_ifms
DB_PORT=3306
PORT=3001
```

Depois, inicie o servidor:

```bash
npm run dev
```

Se tudo estiver correto, o terminal mostra:

```
Servidor rodando em http://localhost:3001
```

Você pode conferir abrindo `http://localhost:3001` no navegador —
deve aparecer `{"mensagem":"API do Sistema de Clubes do IFMS está funcionando."}`.

**Deixe este terminal aberto** — o backend precisa continuar rodando.

### 2.4. Instale e inicie o frontend

Em um **novo terminal** (mantendo o backend rodando no outro):

```bash
cd frontend
npm install
npm run dev
```

O Vite mostra um endereço parecido com:

```
Local: http://localhost:5173/
```

Abra esse endereço no navegador.

---

## 3. Como usar a aplicação

Com o backend e o frontend rodando, abra `http://localhost:5173` no
navegador. Você verá:

1. **Lista de clubes** — os clubes já cadastrados pelo `database.sql`
   aparecem em cartões, com nome, resumo, banner (quando existir) e
   presidente (quando existir).
2. **Criar um clube** — preencha o formulário no topo da página
   (Nome é obrigatório; Resumo, Banner e ID do presidente são
   opcionais) e clique em **"Criar clube"**. O novo clube aparece na
   lista automaticamente.
3. **Editar um clube** — clique em **"Editar"** no cartão desejado.
   O formulário é preenchido com os dados atuais; altere o que
   quiser e clique em **"Salvar alterações"** (ou em **"Cancelar"**
   para desistir).
4. **Excluir um clube** — clique em **"Excluir"** no cartão; será
   pedida uma confirmação antes de remover.

Todas essas ações refletem diretamente no banco `clubes_ifms`
(tabela `clubes`), através da API rodando em `http://localhost:3001`.

## 4. Endpoints da API (para testes com Postman/Insomnia)

Base URL: `http://localhost:3001/api/clubes`

| Método | Rota              | Descrição              |
|--------|-------------------|-------------------------|
| GET    | `/api/clubes`     | Lista todos os clubes   |
| GET    | `/api/clubes/:id` | Busca um clube pelo id  |
| POST   | `/api/clubes`     | Cria um novo clube      |
| PUT    | `/api/clubes/:id` | Atualiza um clube       |
| DELETE | `/api/clubes/:id` | Exclui um clube         |

Exemplo de corpo para POST/PUT:

```json
{
  "nome": "Clube de Fotografia",
  "resumo": "Encontros para prática e crítica fotográfica.",
  "banner": "https://picsum.photos/seed/foto/600/300",
  "presidente_id": null
}
```

## 5. Solução de problemas comuns

- **"Erro ao listar clubes" / tela não carrega nada**: confirme que o
  backend está rodando (`npm run dev` na pasta `backend`) e que o
  `.env` tem os dados corretos do seu MySQL.
- **Erro de conexão com o MySQL** (`ECONNREFUSED` ou similar):
  verifique se o serviço do MySQL está ativo e se `DB_PORT` no `.env`
  corresponde à porta do seu MySQL (geralmente `3306`).
- **`ER_BAD_DB_ERROR: Unknown database 'clubes_ifms'`**: o script
  `database/database.sql` ainda não foi executado — volte ao passo
  2.2.
- **Porta 3001 ou 5173 já em uso**: altere `PORT` no `.env` do
  backend (e o `API_URL` em `frontend/src/services/api.js`), ou finalize
  o processo que já está usando a porta.

## 6. O que NÃO foi implementado nesta fase (de propósito)

Login, JWT, sessões, hash de senha, autorização, middleware de
permissões, upload real de imagens, envio de e-mail, aprovação de
solicitações, sistema completo do Grêmio, regras de presidente,
deploy (Vercel/Render/MySQL hospedado), Helmet, rate limiting, CSRF
e logs avançados. A estrutura já está pronta para receber tudo isso
nas próximas fases.
