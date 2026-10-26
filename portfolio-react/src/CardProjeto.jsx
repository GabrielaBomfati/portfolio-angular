// CardProjeto: um projeto do Portfolio. Os dados chegam de fora, pelas props.
// Entre chaves, no parametro, os nomes das props que o card usa.
function CardProjeto({ nome, descricao, tecnologias, link_github, ano }) {
  return (
    <article className="card">
      <h3>{nome}</h3>
      <p className="meta">{tecnologias} · {ano}</p>
      <p>{descricao}</p>
      <a href={link_github}>Ver no GitHub</a>
    </article>
  );
}

export default CardProjeto;