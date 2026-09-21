---
categoria: css
topico: Introducao-ao-CSS
---

# INTRODUÇÃO AO CSS

Bem-vindo ao mundo do **CSS**! Se o HTML é o esqueleto (a estrutura) da sua página web, o CSS é a pele, as roupas e a maquiagem. É ele que deixa tudo bonito.

**CSS** significa *Cascading Style Sheets* (Folhas de Estilo em Cascata). Ele é usado para formatar o layout de uma página da web.

## O que o CSS faz?

Com o CSS, você pode controlar:
* A cor do texto e do fundo.
* O tamanho e o tipo das fontes.
* O espaçamento entre os elementos.
* Como os elementos são posicionados na tela.
* Adaptações para diferentes tamanhos de tela (computadores, celulares).

## Como adicionar CSS ao HTML?

Existem três formas principais de adicionar CSS a uma página, mas a mais recomendada é usar um **Arquivo Externo**.

### 1. Arquivo Externo (O mais recomendado)
Você cria um arquivo separado com a extensão `.css` (por exemplo, `style.css`) e o conecta ao seu HTML usando a tag `<link>` dentro do `<head>`.

**No HTML:**
```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

### 2. Interno
Você escreve o CSS diretamente dentro do arquivo HTML, usando a tag `<style>` dentro do `<head>`. Ideal apenas para páginas muito simples.

```html
<head>
  <style>
    body { background-color: lightblue; }
  </style>
</head>
```

### 3. Inline
O CSS é escrito diretamente na tag HTML usando o atributo `style`. Isso deve ser evitado, pois deixa o código desorganizado.

```html
<h1 style="color: blue;">Título Azul</h1>
```

Nos próximos tópicos, você aprenderá a escrever suas primeiras regras de estilo!