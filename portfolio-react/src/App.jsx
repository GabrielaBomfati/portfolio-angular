import Cabecalho from './Cabecalho';
import CardProjeto from './CardProjeto';
import Rodape from './Rodape';
import projetos from './projetos';
import Contato from './Contato';

// App: o componente raiz. Ele monta a pagina com os outros componentes.
function App() {
  console.log(projetos);

  return (
    <>
      <Cabecalho />
      <main>
        <h2>Projetos</h2>
        <div className="cards">
          {projetos.map((p) => (
          <CardProjeto
            key={p.id}
            nome={p.nome}
            descricao={p.descricao}
            tecnologias={p.tecnologias}
            link_github={p.link_github}
            ano={p.ano}
          />
          ))}
        </div>
        <Contato/>
      </main>
      <Rodape />
    </>
  );
}

export default App;