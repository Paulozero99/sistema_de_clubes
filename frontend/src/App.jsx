// App.jsx
//
// Responsabilidade: componente raiz da aplicação. Nesta fase 1,
// só existe a página de Clubes, então o App apenas a renderiza.
// Quando o sistema crescer, é aqui que entraria um roteador
// (ex.: react-router-dom) para várias páginas.

import Clubes from './pages/Clubes.jsx';

function App() {
  return (
    <div className="container">
      <header className="cabecalho">
        <h1>Clubes do IFMS - Campus Nova Andradina</h1>
      </header>
      <main>
        <Clubes />
      </main>
    </div>
  );
}

export default App;
