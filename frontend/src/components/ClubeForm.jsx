// ClubeForm.jsx
//
// Responsabilidade: mostrar o formulário de criar/editar clube
// e controlar os valores digitados (useState). Quando o usuário
// envia o formulário, este componente só chama a função
// "aoSalvar" recebida por props — ele não sabe se isso vai gerar
// um POST ou um PUT, isso é decidido pela página (Clubes.jsx).

import { useState, useEffect } from 'react';

const FORM_VAZIO = {
    nome: '',
    resumo: '',
    banner: '',
    presidente_id: '',
};

export default function ClubeForm({ clubeEmEdicao, aoSalvar, aoCancelar }){
    const [form, setForm] = useState(FORM_VAZIO);

    // Sempre que "clubeEmEdicao" mudar (usuário clicou em Editar,
    // ou cancelou a edição), atualizamos os campos do formulário.
    useEffect(() => {
        if(clubeEmEdicao){
            setForm({
                nome: clubeEmEdicao.nome || '',
                resumo: clubeEmEdicao.resumo || '',
                banner: clubeEmEdicao.banner || '',
                presidente_id: clubeEmEdicao.presidente_id || '',
            });
        } 
        else{
            setForm(FORM_VAZIO);
        }
    }, [clubeEmEdicao]);

    function aoMudarCampo(evento){
        const { name, value } = evento.target;
        setForm((formAtual) => ({ ...formAtual, [name]: value }));
    }

    function aoSubmeter(evento){
        evento.preventDefault();

        // Convertemos presidente_id para número (ou null se vazio)
        // antes de enviar para a API.
        const dados = {
            ...form,
            presidente_id: form.presidente_id ? Number(form.presidente_id) : null,
        };

        aoSalvar(dados);
    }

    return(
        <form className="form-clube" onSubmit={aoSubmeter}>
            <h2>{clubeEmEdicao ? 'Editar clube' : 'Novo clube'}</h2>

            <div className="campo">
                <label htmlFor="nome">Nome *</label>
                <input
                id="nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={aoMudarCampo}
                required
                />
            </div>

            <div className="campo">
                <label htmlFor="resumo">Resumo</label>
                <textarea
                id="resumo"
                name="resumo"
                rows={3}
                value={form.resumo}
                onChange={aoMudarCampo}
                />
            </div>

            <div className="campo">
                <label htmlFor="banner">Banner (URL da imagem)</label>
                <input
                id="banner"
                name="banner"
                type="text"
                placeholder="https://..."
                value={form.banner}
                onChange={aoMudarCampo}
                />
            </div>

            <div className="campo">
                <label htmlFor="presidente_id">ID do presidente (opcional)</label>
                <input
                id="presidente_id"
                name="presidente_id"
                type="number"
                value={form.presidente_id}
                onChange={aoMudarCampo}
                />
            </div>

            <div className="acoes-form">
                <button type="submit" className="botao-primario">
                {clubeEmEdicao ? 'Salvar alterações' : 'Criar clube'}
                </button>

                {clubeEmEdicao && (
                <button type="button" className="botao-secundario" onClick={aoCancelar}>
                    Cancelar
                </button>
                )}
            </div>
        </form>
    );
}
