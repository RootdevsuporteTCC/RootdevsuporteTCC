// 1. Organizando as aulas por matéria! 
// Adicione suas aulas na lista correta (HTML, CSS ou JAVASCRIPT).
const aulasPorMateria = {
    'HTML': [
        { arquivo: 'aula-flexbox.md', titulo: 'Como centralizar uma div' },
        { arquivo: 'exemplo-legal.md', titulo: 'Aula de exemplo' }
    ],
    'CSS': [
        { arquivo: 'aula-classes.md', titulo: 'Introdução a Classes' },
        { arquivo: 'aula-jonas.md', titulo: 'Jonas Arruda' }
    ],
    'JAVASCRIPT': [
        // colocar as pasta do JavaScript doidão aqui no futuro
    ]
};

// Descobre qual é a matéria atual baseando-se no título lá da Sidebar
const materiaAtual = document.getElementById('matter-title').innerText.toUpperCase();
const listaDeAulas = aulasPorMateria[materiaAtual] || [];

// 2. Função que preenche o menu lateral (sidebar)
function carregarMenuLateral() {
    const topicsList = document.getElementById('topics-list');
    topicsList.innerHTML = ''; // Limpa a lista para evitar duplicações

    listaDeAulas.forEach(aula => {
        const li = document.createElement('li');
        li.innerText = aula.titulo;
        
        // Adiciona o evento de clique: ao clicar, carrega o arquivo .md desta aula
        li.onclick = () => carregarAulaConteudo(aula.arquivo);
        
        topicsList.appendChild(li);
    });
}

// 3. Função que busca o arquivo .md e joga na tela
function carregarAulaConteudo(nomeArquivo) {
    // Transforma o nome da matéria em minúsculo para achar a pasta (HTML vira html)
    const pastaMateria = materiaAtual.toLowerCase();

    // Como o JS é executado dentro do HTML que está na pasta /matters/, 
    // a raiz do diretório daqui pra frente é ./aulas/{pastaMateria}/
    fetch(`./aulas/${pastaMateria}/${nomeArquivo}`)
      .then(resposta => resposta.text())
      .then(textoMd => {
          const htmlGerado = marked.parse(textoMd);
          
          const lessonContent = document.getElementById('lesson-content');
          lessonContent.innerHTML = htmlGerado;

          const tituloAula = lessonContent.querySelector('h1');
          if (tituloAula) {
              tituloAula.classList.add('disket-font', 'title-center'); 
              document.getElementById('page-title').innerText = tituloAula.innerText + " - " + materiaAtual;
          }
      })
      .catch(erro => {
          console.error("Erro ao carregar o Markdown da aula:", erro);
      });
}

// 4. Inicialização: Quando a página carregar, ele gera o menu e já abre a primeira aula da lista
carregarMenuLateral();

if (listaDeAulas.length > 0) {
    carregarAulaConteudo(listaDeAulas[0].arquivo); // Carrega a aula do índice 0 (a primeira)
}