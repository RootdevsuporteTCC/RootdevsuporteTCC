---
categoria: javascript
topico: Eventos
---

# EVENTOS JAVASCRIPT

A interatividade acontece quando o seu site consegue "reagir" às ações do usuário. Essas ações são chamadas de **Eventos**.

Alguns exemplos de eventos comuns:
* O usuário clica em um botão.
* O usuário passa o mouse sobre uma imagem.
* O usuário digita algo no teclado.
* A página termina de carregar.

## O Evento de Clique (`onclick`)

O JavaScript consegue "escutar" esses eventos no HTML e rodar um código quando eles acontecem. O jeito mais simples de fazer isso é adicionando um atributo de evento diretamente na tag HTML.

Vamos usar o atributo `onclick` em um botão para executar uma função quando ele for clicado.

### No HTML:

```html
<!-- Quando clicar, chama a função mostrarAlerta() -->
<button onclick="mostrarAlerta()">Clique em mim!</button>
```

### No JavaScript:

```javascript
function mostrarAlerta() {
  alert("Você clicou no botão! O evento funcionou.");
}
```

## Alterando o HTML com Eventos

Uma das coisas mais legais é mudar a aparência da página com um clique.

```html
<!-- Um parágrafo com um ID para o JS achá-lo -->
<p id="texto-secreto">Este texto vai mudar.</p>

<!-- Um botão que muda o texto -->
<button onclick="mudarTexto()">Revelar Segredo</button>
```

```javascript
function mudarTexto() {
  // Acha o parágrafo pelo ID e muda o conteúdo interno dele
  document.getElementById("texto-secreto").innerHTML = "A programação é incrível!";
}
```