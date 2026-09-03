// O fetch vai buscar o arquivo JSON
fetch('./aulas/aula-flexbox.json')
  .then(resposta => resposta.json()) // Converte a resposta para JSON
  .then(dados => {
      // Pega os dados do JSON e joga nos IDs do HTML
      document.getElementById('page-title').innerText = dados.titulo_da_pagina;
      document.getElementById('matter-title').innerText = dados.nome_da_materia;
      document.getElementById('lesson-title').innerText = dados.titulo_da_aula;
      
      document.getElementById('lesson-explanation').innerText = dados.texto_explicativo;
      
      document.getElementById('lesson-code-label-1').innerText = dados.label_codigo_1;
      document.getElementById('lesson-code-block-1').innerText = dados.codigo_1;
  })
  .catch(erro => {
      console.error("Erro ao carregar o JSON da aula:", erro);
  });