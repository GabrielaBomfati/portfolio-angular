// Cabeçalho: a barra de topo do Portfólio, com o nome e os links.
// Um componente é uma função que devolve JSX. O nome começa com maiúscula.
function Cabecalho() {
  return (
    <header>
      <h1>Meu Portfólio</h1>
      <nav>
        <a href="#">Início</a>
        <a href="#">Sobre</a>
        <a href="#">Projetos</a>
        <a href="#">Contato</a>
      </nav>
    </header>
  );
}

export default Cabecalho;