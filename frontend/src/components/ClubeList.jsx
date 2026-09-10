// ClubeList.jsx
//
// Responsabilidade: receber a lista de clubes (array) e
// renderizar um <ClubeCard /> para cada item. Também trata o
// caso de lista vazia.

import ClubeCard from './ClubeCard.jsx';

function ClubeList({ clubes, aoEditar, aoExcluir }) {
  if (clubes.length === 0) {
    return <p>Nenhum clube cadastrado ainda.</p>;
  }

  return (
    <div className="lista-clubes">
      {clubes.map((clube) => (
        <ClubeCard
          key={clube.id}
          clube={clube}
          aoEditar={aoEditar}
          aoExcluir={aoExcluir}
        />
      ))}
    </div>
  );
}

export default ClubeList;
