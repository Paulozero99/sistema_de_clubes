// ClubeCard.jsx
//
// Responsabilidade: mostrar as informações de UM clube (nome,
// resumo, banner, presidente) e os botões de editar/excluir.
// Este componente não faz fetch nem guarda estado — ele só
// recebe dados prontos via props e "avisa" o componente pai
// quando o usuário clica em editar ou excluir.

export default function ClubeCard({clube, aoEditar, aoExcluir}){
    return(
        <div className="card-clube">
        {clube.banner && <img src={clube.banner} alt={`Banner do ${clube.nome}`} />}

            <div className="card-clube-corpo">
                <h3>{clube.nome}</h3>
                <p>{clube.resumo || 'Sem resumo cadastrado.'}</p>

                {clube.presidente_nome && (
                <p className="presidente">Presidente: {clube.presidente_nome}</p>
                )}

                <div className="card-clube-acoes">
                    <button className="botao-secundario" onClick={() => aoEditar(clube)}>
                        Editar
                    </button>
                    <button className="botao-perigo" onClick={() => aoExcluir(clube.id)}>
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}