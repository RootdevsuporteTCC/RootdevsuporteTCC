---
categoria: html
topico: elementos-e-tags
---

# ELEMENTOS E TAGS HTML

O HTML é feito de **Elementos**. Esses elementos indicam ao navegador como o conteúdo deve ser exibido. Para criar um elemento, usamos as **Tags** (etiquetas).

Uma tag HTML é escrita usando os símbolos de menor que (`<`) e maior que (`>`). 

## A anatomia de um Elemento

Na grande maioria das vezes, um elemento HTML possui três partes:
1. Uma **Tag de Abertura**: `<nome-da-tag>`
2. O **Conteúdo**: O texto ou informação que você quer mostrar.
3. Uma **Tag de Fechamento**: `</nome-da-tag>` (Note a barra `/` antes do nome).

### Exemplo:
```html
<p>Este é o meu parágrafo.</p>
```
Neste exemplo:
* `<p>` é a tag de abertura, indicando o início de um parágrafo.
* `Este é o meu parágrafo.` é o conteúdo que aparecerá na tela.
* `</p>` é a tag de fechamento, indicando onde o parágrafo termina.

## Elementos Vazios

Existem alguns elementos HTML que **não possuem conteúdo** e, por isso, **não precisam de uma tag de fechamento**. Eles são chamados de elementos vazios.

O exemplo mais comum é a tag de quebra de linha: `<br>`.

```html
<p>Esta é a primeira linha do meu texto.<br>Esta é a segunda linha.</p>
```

A tag `<br>` funciona como apertar a tecla "Enter" no teclado, jogando o restante do texto para a linha de baixo. Como ela apenas dá um comando de quebra, ela não envolve nenhum texto, dispensando a tag de fechamento.