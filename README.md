# Sistema de Gerenciamento de Clubes — IFMS Campus Nova Andradina

**Fase 1 — Base funcional: CRUD de clubes**

Este projeto é a primeira fase de um sistema web para gerenciar os
clubes estudantis do IFMS Campus Nova Andradina. Nesta fase **não**
há login, autorização, upload real de imagens ou deploy — o
objetivo é ter uma base organizada e didática, funcionando 100% em
ambiente local, para depois evoluir.

## Estrutura do projeto

```
sistema-clubes/
├── backend/                 API REST (Node + Express + mysql2)
│   ├── src/
│   │   ├── server.js        monta a aplicação Express
│   │   ├── database.js      pool de conexões com o MySQL
│   │   ├── routes/          define as URLs (endpoints)
│   │   └── controllers/     executa as queries e monta a resposta
│   ├── .env.example
│   └── package.json
├── frontend/                Interface (React + Vite)
│   └── src/
│       ├── components/      ClubeCard, ClubeForm, ClubeList
│       ├── pages/           Clubes.jsx (página principal)
│       ├── services/        api.js (chamadas fetch)
│       ├── App.jsx
│       └── main.jsx
└── database/
    └── database.sql         cria o banco, tabelas e dados de teste
```

## Fluxo geral da aplicação

```
MySQL  ←→  mysql2 (pool)  ←→  Controller  ←→  Route  ←→  Express (API REST)
                                                              ↑
                                                           fetch()
                                                              ↑
                                                    React (services/api.js)
                                                              ↑
                                                 componentes (ClubeForm, ClubeList...)
```

1. O usuário interage com a tela React (ex.: preenche o formulário e
   clica em "Criar clube").
2. O componente chama uma função de `services/api.js`, que faz um
   `fetch()` para a API Express.
3. A **rota** (`clubes.routes.js`) recebe a requisição e chama o
   **controller** correspondente.
4. O **controller** (`clubes.controller.js`) executa a query SQL via
   `mysql2`, usando o pool definido em `database.js`.
5. O controller monta a resposta em JSON e devolve com o status HTTP
   correto (200, 201, 400, 404 ou 500).
6. O React recebe o JSON e atualiza o estado (`useState`), o que
   redesenha a tela automaticamente.

---

## 1. Requisitos

- Node.js 18 ou superior
- MySQL 8 (ou compatível) instalado e rodando localmente
- Um cliente para rodar scripts SQL (MySQL Workbench, DBeaver, linha
  de comando `mysql`, etc.)

## 2. Criando o banco de dados

1. Abra seu cliente MySQL.
2. Execute o arquivo `database/database.sql` inteiro. Ele já cria o
   banco `clubes_ifms`, todas as tabelas e insere dados de teste
   (usuários, clubes, membros, atividades e solicitações).

Pela linha de comando, por exemplo:

```bash
mysql -u root -p < database/database.sql
```

## 3. Instalando e rodando o backend

```bash
cd backend
npm install
cp .env.example .env
```

Abra o `.env` e ajuste `DB_USER`, `DB_PASSWORD` etc. conforme o seu
MySQL local. Depois:

```bash
npm run dev
```

O servidor sobe em `http://localhost:3001`. Acessar essa URL no
navegador deve mostrar `{"mensagem":"API do Sistema de Clubes do IFMS está funcionando."}`.

## 4. Instalando e rodando o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite sobe em `http://localhost:5173`. Abra essa URL no navegador —
a lista de clubes deve carregar automaticamente (vindo do backend).

---

## 5. Endpoints da API

Base URL: `http://localhost:3001/api/clubes`

| Método | Rota            | Descrição                  | Sucesso |
|--------|-----------------|-----------------------------|---------|
| GET    | `/api/clubes`   | Lista todos os clubes       | 200     |
| GET    | `/api/clubes/:id` | Busca um clube pelo id    | 200 / 404 |
| POST   | `/api/clubes`   | Cria um novo clube          | 201 / 400 |
| PUT    | `/api/clubes/:id` | Atualiza um clube        | 200 / 400 / 404 |
| DELETE | `/api/clubes/:id` | Exclui um clube          | 200 / 404 |

### Exemplo — criar clube (POST `/api/clubes`)

Corpo da requisição:

```json
{
  "nome": "Clube de Fotografia",
  "resumo": "Encontros para prática e crítica fotográfica.",
  "banner": "https://picsum.photos/seed/foto/600/300",
  "presidente_id": null
}
```

Resposta (201):

```json
{
  "id": 4,
  "nome": "Clube de Fotografia",
  "resumo": "Encontros para prática e crítica fotográfica.",
  "banner": "https://picsum.photos/seed/foto/600/300",
  "presidente_id": null
}
```

### Exemplo — erro de validação (400)

```json
{ "erro": "O campo \"nome\" é obrigatório." }
```

### Exemplo — clube não encontrado (404)

```json
{ "erro": "Clube não encontrado." }
```

---

## 6. Conceitos explicados

**O que é uma API REST?**
É um conjunto de URLs (endpoints) que o frontend acessa via HTTP
(GET, POST, PUT, DELETE) para ler ou modificar dados. Cada
combinação de método + URL representa uma ação — por exemplo,
`GET /api/clubes` significa "listar clubes".

**O que é uma rota no Express?**
É a definição de "quando chegar uma requisição HTTP nesta URL, com
este método, execute esta função". Em `clubes.routes.js`,
`router.get('/', listarClubes)` diz: "quando alguém fizer um GET em
`/api/clubes`, chame a função `listarClubes`".

**O que é um controller?**
É a função que efetivamente resolve a requisição: lê os dados de
entrada, consulta o banco e devolve a resposta. Separar rota de
controller deixa o código organizado — a rota só "aponta", o
controller "faz".

**Como `req.params` funciona?**
Guarda os valores que vêm dentro da própria URL. Na rota
`/:id`, se o frontend acessa `/api/clubes/5`, então
`req.params.id` vale `"5"`.

**Como `req.body` funciona?**
Guarda os dados enviados no corpo da requisição (usado em POST e
PUT), normalmente em JSON. O middleware `express.json()` (ligado em
`server.js`) é o responsável por transformar esse JSON em um objeto
JavaScript acessível via `req.body`.

**Como `res.json()` funciona?**
Envia uma resposta ao cliente já formatada como JSON, definindo
automaticamente o cabeçalho `Content-Type: application/json`.
Encadeado com `.status(200)`, também define o código HTTP da
resposta.

**Como o mysql2 executa queries?**
`pool.query(sql, valores)` envia o SQL para o MySQL. Usamos `?` como
"placeholders" no SQL e passamos os valores reais em um array
separado — isso é chamado de **query parametrizada** e evita que
dados digitados pelo usuário sejam interpretados como comandos SQL
(SQL Injection).

**Como o pool de conexões funciona?**
Em vez de abrir uma conexão nova com o MySQL a cada requisição (o
que é lento), o `mysql2/promise` mantém um conjunto de conexões já
abertas e as reaproveita. `database.js` cria esse pool uma única vez
e todos os controllers o importam.

**Como `fetch()` funciona?**
É a API nativa do navegador para fazer requisições HTTP.
`fetch(url, opções)` retorna uma Promise; usamos `await` para
esperar a resposta e depois `.json()` para converter o corpo da
resposta em um objeto JavaScript.

**Como o React usa `useEffect` para buscar dados?**
`useEffect(() => { ... }, [])` executa a função passada uma vez,
logo depois que o componente aparece na tela (o array vazio `[]`
significa "não depende de nada, rode só uma vez"). É o lugar comum
para disparar a busca inicial de dados na API.

**Como `useState` armazena os dados da API?**
`const [clubes, setClubes] = useState([])` cria uma variável de
estado (`clubes`) e uma função para atualizá-la (`setClubes`).
Quando a API responde, chamamos `setClubes(dados)` — o React então
re-renderiza automaticamente os componentes que usam `clubes`.

---

## 7. O que NÃO foi implementado nesta fase (de propósito)

Login, JWT, sessões, hash de senha, autorização, middleware de
permissões, upload real de imagens, envio de e-mail, aprovação de
solicitações, sistema completo do Grêmio, regras de presidente,
deploy (Vercel/Render/MySQL hospedado), Helmet, rate limiting, CSRF
e logs avançados. A estrutura (rotas separadas de controllers, pool
de conexões, tabelas já modeladas para usuários/solicitações) foi
pensada para permitir adicionar tudo isso depois sem reescrever o
projeto.
