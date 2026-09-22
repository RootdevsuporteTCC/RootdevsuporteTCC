---
categoria: css
topico: seletores
---

# Seletores

O seletor indica quais elementos serão atingidos por uma regra CSS.

Considere este HTML:

```html
<h1 id="titulo-principal">Meus estudos</h1>
<p class="aviso">Uma nova aula está disponível.</p>
<p>Escolha um assunto para continuar.</p>
```

## Selecionando pelo elemento

```css
p {
    line-height: 1.5;
}
```

A regra é aplicada aos elementos **p**. Nesse caso, ela altera o espaçamento entre as linhas dos parágrafos.

## Selecionando pela classe

```css
.aviso {
    color: #650080;
}
```

O **.** antes do nome indica uma classe. A regra atinge os elementos que possuem **class="aviso"**.

## Selecionando pelo id

```css
#titulo-principal {
    font-size: 32px;
}
```

O **#** indica um **id**. Esse identificador deve ser único na página.

## Agrupando seletores

```css
h1, h2 {
    font-family: Arial, sans-serif;
}
```

A **,** permite aplicar as mesmas declarações aos títulos **h1** e **h2**.

## Seletor universal

```css
* {
    box-sizing: border-box;
}
```

O **\*** seleciona todos os elementos. No exemplo, ele define uma forma de calcular suas dimensões, assunto apresentado na aula de Box Model.