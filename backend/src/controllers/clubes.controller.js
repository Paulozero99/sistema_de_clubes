// clubes.controller.js
//
// Responsabilidade: receber os dados que já chegaram da rota
// (req.params, req.body), executar a consulta correspondente no
// banco através do pool do mysql2, e devolver uma resposta em
// JSON (res.json) com o status HTTP correto.
//
// O controller é o único lugar do backend que conhece a
// estrutura da tabela "clubes" e escreve SQL para ela.

import pool from '../database.js';

// GET /api/clubes
// Lista todos os clubes. Faz um JOIN com usuarios para trazer
// o nome do presidente junto (quando existir).
export async function listarClubes(req, res) {
  try {
    const [linhas] = await pool.query(
      `SELECT c.id, c.nome, c.resumo, c.banner, c.presidente_id,
              c.ativo, c.criado_em, u.nome AS presidente_nome
         FROM clubes c
         LEFT JOIN usuarios u ON u.id = c.presidente_id
        ORDER BY c.id DESC`
    );
    res.status(200).json(linhas);
  } catch (erro) {
    console.error('Erro ao listar clubes:', erro);
    res.status(500).json({ erro: 'Erro interno ao listar clubes.' });
  }
}

// GET /api/clubes/:id
// Busca um único clube pelo id.
export async function buscarClube(req, res) {
  try {
    const { id } = req.params;

    const [linhas] = await pool.query(
      `SELECT c.id, c.nome, c.resumo, c.banner, c.presidente_id,
              c.ativo, c.criado_em, u.nome AS presidente_nome
         FROM clubes c
         LEFT JOIN usuarios u ON u.id = c.presidente_id
        WHERE c.id = ?`,
      [id]
    );

    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Clube não encontrado.' });
    }

    res.status(200).json(linhas[0]);
  } catch (erro) {
    console.error('Erro ao buscar clube:', erro);
    res.status(500).json({ erro: 'Erro interno ao buscar clube.' });
  }
}

// POST /api/clubes
// Cria um novo clube. Validação simples: nome é obrigatório.
export async function criarClube(req, res) {
  try {
    const { nome, resumo, banner, presidente_id } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
    }

    const [resultado] = await pool.query(
      `INSERT INTO clubes (nome, resumo, banner, presidente_id)
       VALUES (?, ?, ?, ?)`,
      [nome, resumo || null, banner || null, presidente_id || null]
    );

    res.status(201).json({
      id: resultado.insertId,
      nome,
      resumo: resumo || null,
      banner: banner || null,
      presidente_id: presidente_id || null,
    });
  } catch (erro) {
    console.error('Erro ao criar clube:', erro);
    res.status(500).json({ erro: 'Erro interno ao criar clube.' });
  }
}

// PUT /api/clubes/:id
// Atualiza um clube existente.
export async function atualizarClube(req, res) {
  try {
    const { id } = req.params;
    const { nome, resumo, banner, presidente_id } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
    }

    const [resultado] = await pool.query(
      `UPDATE clubes
          SET nome = ?, resumo = ?, banner = ?, presidente_id = ?
        WHERE id = ?`,
      [nome, resumo || null, banner || null, presidente_id || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Clube não encontrado.' });
    }

    res.status(200).json({ id: Number(id), nome, resumo, banner, presidente_id });
  } catch (erro) {
    console.error('Erro ao atualizar clube:', erro);
    res.status(500).json({ erro: 'Erro interno ao atualizar clube.' });
  }
}

// DELETE /api/clubes/:id
export async function excluirClube(req, res) {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query('DELETE FROM clubes WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Clube não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Clube excluído com sucesso.' });
  } catch (erro) {
    console.error('Erro ao excluir clube:', erro);
    res.status(500).json({ erro: 'Erro interno ao excluir clube.' });
  }
}
