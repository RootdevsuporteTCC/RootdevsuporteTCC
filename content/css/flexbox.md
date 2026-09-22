---
categoria: css
topico: flexbox
---

# Flexbox

O Flexbox organiza os filhos diretos de um elemento em uma linha ou coluna. Ele facilita o alinhamento e a distribuição do espaço disponível.

No HTML:

```html
<div class="categorias">
    <a href="html.html">HTML</a>
    <a href="css.html">CSS</a>
    <a href="javascript.html">JavaScript</a>
</div>
```

Os links são exemplos. Para funcionarem, os arquivos de destino precisam existir.

No CSS:

```css
.categorias {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    min-height: 200px;
}
```

## Entendendo o alinhamento

O **display: flex** transforma o elemento em um contêiner flexível.

O **flex-direction** define o eixo principal. No contexto de escrita horizontal:

- **row:** organiza os itens em linha.
- **column:** organiza os itens em coluna.

O **justify-content** alinha os itens no eixo principal. O **align-items** atua no eixo transversal.

Por isso, não é correto afirmar que uma dessas propriedades sempre controla o alinhamento horizontal. Isso depende da direção escolhida.

No exemplo, ambas recebem **center** para centralizar os itens.

## Espaçamento e quebra de linha

O **gap** cria espaço entre os itens.

O **flex-wrap: wrap** permite que eles ocupem outras linhas quando não houver espaço suficiente. Isso ajuda o conteúdo a se adaptar a telas menores.