// 1. Crie a lista com as suas aulas aqui.
// Sempre que criar um novo arquivo .md, basta adicionar uma nova linha nesta lista!
const listaDeAulas = [
    { arquivo: 'aula-flexbox.md', titulo: 'Como centralizar uma div' },
    { arquivo: 'exemplo-legal.md', titulo: 'Aula de exemplo' }
];

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

// 3. Função que busca o arquivo .md e joga na tela (mesma lógica que você já tinha)
function carregarAulaConteudo(nomeArquivo) {
    fetch(`./aulas/html/${nomeArquivo}`)
      .then(resposta => resposta.text())
      .then(textoMd => {
          const htmlGerado = marked.parse(textoMd);
          
          const lessonContent = document.getElementById('lesson-content');
          lessonContent.innerHTML = htmlGerado;

          const tituloAula = lessonContent.querySelector('h1');
          if (tituloAula) {
              tituloAula.classList.add('disket-font', 'title-center'); 
              const nomeMateria = document.getElementById('matter-title').innerText;
              document.getElementById('page-title').innerText = tituloAula.innerText + " - " + nomeMateria;
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