---
categoria: css
topico: Textos-e-Fontes
---

# TEXTOS E FONTES

A forma como você apresenta o texto (a tipografia) é fundamental para a leitura e o visual do seu site. O CSS tem várias propriedades para isso.

## Formatando Textos

### Alinhamento de Texto (`text-align`)
Define se o texto ficará na esquerda, direita, centralizado ou justificado.

```css
h1 {
  text-align: center; /* Centraliza o texto */
}
p {
  text-align: justify; /* Deixa as bordas do texto retas */
}
```

### Decoração de Texto (`text-decoration`)
Muito usado para remover o sublinhado padrão dos links, ou para adicionar sublinhados/riscados.

```css
a {
  text-decoration: none; /* Remove o sublinhado dos links */
}
.riscado {
  text-decoration: line-through; /* Cria um texto riscado */
}
```

## Trabalhando com Fontes

### Família da Fonte (`font-family`)
Muda o estilo da letra. Você deve listar algumas fontes como "reserva", separadas por vírgula. Se o computador do usuário não tiver a primeira, ele tenta a segunda.

```css
p {
  font-family: "Arial", sans-serif;
}
```

### Tamanho da Fonte (`font-size`)
Define o tamanho do texto. Pode ser em pixels (`px`), `em`, ou `rem`.

```css
h2 {
  font-size: 24px;
}
```

### Peso da Fonte (`font-weight`)
Controla a espessura da letra (se é negrito ou não).

```css
.negrito {
  font-weight: bold; /* ou valores numéricos como 700 */
}
.fino {
  font-weight: normal; /* ou valores como 400 */
}
```