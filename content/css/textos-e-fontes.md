---
categoria: css
topico: textos-e-fontes
---

# Textos e fontes

O CSS permite ajustar a fonte, o tamanho das letras, o alinhamento e o espaçamento do texto.

No HTML:

```html
<h1 class="titulo">Organização dos estudos</h1>
<p class="descricao">Separe um período para revisar o conteúdo de cada aula.</p>
```

No CSS:

```css
.titulo {
    font-family: Arial, sans-serif;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
}

.descricao {
    font-family: Arial, sans-serif;
    font-size: 18px;
    line-height: 1.5;
}
```

## Entendendo as propriedades

- **font-family:** define a fonte. Se Arial não estiver disponível, o navegador usa uma fonte da família genérica **sans-serif**.
- **font-size:** define o tamanho das letras.
- **font-weight:** controla o peso da fonte. O valor **bold** aplica negrito.
- **text-align:** define o alinhamento do texto dentro do elemento.
- **line-height:** controla a altura das linhas. O valor **1.5** acompanha o tamanho da fonte.

## Decoração do texto

A propriedade **text-decoration** pode adicionar ou remover decorações:

```css
.destaque {
    text-decoration: underline;
}
```

Nesse caso, o texto fica sublinhado.

Em links, o sublinhado ajuda a identificar que o texto pode ser clicado. Se ele for removido, mantenha outra indicação visual clara.