// projetos: os dados do Portfolio, num arquivo só deles. Uma lista de objetos.
// Cada objeto tem os campos que a API devolve. Na Aula 27 a lista passa a vir de la.
const projetos = [
  {
    id: 1,
    nome: 'Portfolio Angular',
    descricao: 'Meu portfolio com Angular e Angular Material.',
    tecnologias: 'Angular, TypeScript',
    link_github: 'https://github.com/seu-usuario/2026-DWIT-portfolio-angular',
    ano: 2026,
  },
  {
    id: 2,
    nome: 'API do Portfolio em PHP',
    descricao: 'Endpoints de projetos e catalogo com PDO e MariaDB.',
    tecnologias: 'PHP, MariaDB',
    link_github: null,
    ano: 2026,
  },
  {
    id: 3,
    nome: 'Sistema de Cadastro v1',
    descricao: 'CRUD em PHP do 1o trimestre.',
    tecnologias: 'PHP, MariaDB, Bootstrap',
    link_github: null,
    ano: 2026,
  },
  {
    id: 4,
    nome: 'API do Portfolio em Node',
    descricao: 'A mesma API reescrita em Express, com login e token.',
    tecnologias: 'Node, Express, MariaDB',
    link_github: null,
    ano: 2026,
  },
];

export default projetos;