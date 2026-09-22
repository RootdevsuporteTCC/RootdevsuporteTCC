---
categoria: css
topico: introducao-ao-css
---

# Introdução ao CSS

O CSS define a apresentação dos elementos de uma página. Com ele, podemos alterar cores, fontes, espaçamentos, dimensões e a organização do conteúdo na tela.

Uma regra CSS contém um seletor e um conjunto de declarações:

```css
h1 {
    color: #650080;
    font-size: 32px;
}
```

O seletor **h1** indica quais elementos receberão a regra. Dentro das chaves, cada declaração possui uma propriedade e um valor, separados por **:**.

Nesse exemplo, o título recebe uma cor e um tamanho de fonte.

## Usando um arquivo separado

Crie um arquivo chamado **estilo.css** na mesma pasta do HTML:

```css
body {
    background-color: #eeeeee;
    color: #222222;
}

h1 {
    color: #650080;
}
```

Dentro do **head** do HTML, adicione:

```html
<link rel="stylesheet" href="estilo.css">
```

O **href** aponta para o arquivo de estilos. Assim, o mesmo CSS pode ser utilizado por várias páginas.

Também é possível escrever CSS dentro de um elemento **style** no **head**, ou no atributo **style** de um elemento. Um arquivo separado facilita a organização quando o projeto possui várias regras.