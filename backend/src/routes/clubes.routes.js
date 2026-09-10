// clubes.routes.js
//
// Responsabilidade: definir QUAIS URLs existem e QUAL função do
// controller cada uma chama. A rota não sabe nada de SQL — ela
// só "aponta" a requisição para o controller correto.

import {Router} from 'express';
import {
    listarClubes,
    buscarClube,
    criarClube,
    atualizarClube,
    excluirClube,
} from '../controllers/clubes.controller.js';

const router = Router();

router.get('/', listarClubes);        // GET    /api/clubes
router.get('/:id', buscarClube);      // GET    /api/clubes/:id
router.post('/', criarClube);         // POST   /api/clubes
router.put('/:id', atualizarClube);   // PUT    /api/clubes/:id
router.delete('/:id', excluirClube);  // DELETE /api/clubes/:id

export default router;
