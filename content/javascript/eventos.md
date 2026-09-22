---
categoria: javascript
topico: eventos
---

# Eventos

Os eventos permitem executar código quando algo acontece na página, como um clique, uma alteração em um campo ou o envio de um formulário.

## Respondendo a um clique

No **body** do HTML, coloque:

```html
<button id="botao-contar" type="button">Registrar clique</button>
<p id="contador">Cliques: 0</p>
```

No **head**, carregue o JavaScript:

```html
<script src="script.js" defer></script>
```

No arquivo **script.js**, escreva:

```javascript
const botao = document.getElementById("botao-contar")
const contador = document.getElementById("contador")

let quantidade = 0

function registrarClique() {
    quantidade = quantidade + 1

    contador.innerText = "Cliques: " + quantidade
}

botao.addEventListener("click", registrarClique)
```

## Como funciona

O código seleciona o botão e o parágrafo.

O **addEventListener** registra a função que será executada quando acontecer o evento **click**.

A cada clique, **registrarClique** aumenta a quantidade e atualiza o texto.

Na última linha, o nome da função aparece sem **()**. Estamos passando a função para ser executada quando o evento ocorrer, em vez de executá-la naquele momento.

O **defer** garante, nesse script externo, que os elementos do HTML estejam disponíveis antes da execução.

## Outros eventos

- **input:** ocorre quando o usuário altera o valor de um campo.
- **submit:** ocorre quando um formulário é enviado.
- **change:** ocorre quando uma alteração é confirmada em determinados controles.