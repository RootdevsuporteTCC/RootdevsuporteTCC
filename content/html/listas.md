---
categoria: html
topico: listas
---

# LISTAS NO HTML

Muitas vezes precisamos agrupar itens em formato de lista (como receitas, passos a seguir ou lista de compras). O HTML fornece duas tags principais para listas: as Não-Ordenadas e as Ordenadas.

## 1. Listas Não-Ordenadas (`<ul>`)

Usadas quando a ordem dos itens **não importa** (como uma lista de compras). Ela adiciona "bolinhas" (marcadores) antes de cada item.

Criamos a lista usando a tag `<ul>` (Unordered List). Cada item dentro dela deve ser marcado com a tag `<li>` (List Item).

```html
<h3>Ingredientes do Bolo:</h3>
<ul>
    <li>Farinha</li>
    <li>Açúcar</li>
    <li>Leite</li>
    <li>Ovos</li>
</ul>
```

## 2. Listas Ordenadas (`<ol>`)

Usadas quando a ordem dos itens **é importante** (como um passo a passo numérico). Ela adiciona números automaticamente (1, 2, 3...) antes de cada item.

Criamos a lista usando a tag `<ol>` (Ordered List). Os itens também usam a tag `<li>`.

```html
<h3>Como fazer o bolo:</h3>
<ol>
    <li>Misture os ingredientes secos.</li>
    <li>Adicione o leite e os ovos.</li>
    <li>Bata tudo na batedeira.</li>
    <li>Leve ao forno por 40 minutos.</li>
</ol>
```

Dessa forma, se você adicionar ou remover um `<li>` do meio da lista, o HTML recalcula a numeração automaticamente para você, sem que você precise corrigir os números manualmente!