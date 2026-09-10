// Clubes.jsx
//
// Responsabilidade: esta é a página "dona" dos dados. Ela:
// - guarda a lista de clubes, o estado de carregamento e erro
// - busca os clubes na API quando a página carrega (useEffect)
// - decide se o formulário está criando ou editando
// - chama os serviços de api.js e atualiza a lista depois
//
// ClubeForm e ClubeList só recebem dados e funções por props;
// toda a "inteligência" fica concentrada aqui.

import { useEffect, useState } from 'react';
import {
    buscarClubes,
    criarClube,
    atualizarClube,
    excluirClube,
} from '../services/api.js';
import ClubeForm from '../components/ClubeForm.jsx';
import ClubeList from '../components/ClubeList.jsx';

function Clubes() {
    const [clubes, setClubes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [clubeEmEdicao, setClubeEmEdicao] = useState(null);

    // Busca os clubes uma vez, quando o componente é montado.
    useEffect(() => {
        carregarClubes();
    }, []);

    async function carregarClubes() {
        try{
            setCarregando(true);
            setErro('');
            const dados = await buscarClubes();
            setClubes(dados);
        } 
        catch(erroCapturado){
            setErro(erroCapturado.message);
        } 
        finally{
            setCarregando(false);
        }
    }

    async function aoSalvar(dadosForm) {
        try {
            setErro('');

            if(clubeEmEdicao){
                await atualizarClube(clubeEmEdicao.id, dadosForm);
            } 
            else{
                await criarClube(dadosForm);
            }

            setClubeEmEdicao(null);
            await carregarClubes(); // recarrega a lista com os dados atualizados
        } 
        catch(erroCapturado){
            setErro(erroCapturado.message);
        }
    }

    async function aoExcluir(id){
        const confirmar = window.confirm('Tem certeza que deseja excluir este clube?');
        if (!confirmar) return;

        try{
            setErro('');
            await excluirClube(id);
            await carregarClubes();
        } 
        catch(erroCapturado){
            setErro(erroCapturado.message);
        }
    }

    function aoEditar(clube) {
        setClubeEmEdicao(clube);
    }

    function aoCancelarEdicao() {
        setClubeEmEdicao(null);
    }

    return (
        <section>
            <ClubeForm
                clubeEmEdicao={clubeEmEdicao}
                aoSalvar={aoSalvar}
                aoCancelar={aoCancelarEdicao}
            />

            {erro && <p className="erro">{erro}</p>}
            {carregando && <p className="carregando">Carregando clubes...</p>}

            {!carregando && (
                <ClubeList clubes={clubes} aoEditar={aoEditar} aoExcluir={aoExcluir} />
            )}
        </section>
    );
}

export default Clubes;
