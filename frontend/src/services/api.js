// api.js
//
// Responsabilidade: ser o ÚNICO lugar do frontend que conhece o
// endereço da API e monta as chamadas fetch(). Os componentes
// React chamam essas funções e não sabem nada sobre URLs, HTTP
// ou JSON.stringify — eles só recebem objetos JavaScript prontos.

const API_URL = 'http://localhost:3001/api/clubes';

// Função auxiliar: trata a resposta do fetch, convertendo em
// JSON e lançando um erro caso o status não seja de sucesso.
async function tratarResposta(resposta) {
  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const mensagem = dados?.erro || `Erro na requisição (status ${resposta.status})`;
    throw new Error(mensagem);
  }

  return dados;
}

// GET /api/clubes
export async function buscarClubes() {
  const resposta = await fetch(API_URL);
  return tratarResposta(resposta);
}

// GET /api/clubes/:id
export async function buscarClube(id) {
  const resposta = await fetch(`${API_URL}/${id}`);
  return tratarResposta(resposta);
}

// POST /api/clubes
export async function criarClube(dados) {
  const resposta = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return tratarResposta(resposta);
}

// PUT /api/clubes/:id
export async function atualizarClube(id, dados) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return tratarResposta(resposta);
}

// DELETE /api/clubes/:id
export async function excluirClube(id) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return tratarResposta(resposta);
}
