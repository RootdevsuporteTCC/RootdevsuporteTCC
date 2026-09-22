---
categoria: html
topico: elementos-e-tags
---

# Elementos e tags

As tags são marcações que identificam os elementos do HTML. Geralmente, um elemento possui uma tag de abertura, um conteúdo e uma tag de fechamento.

```html
<p>Estou estudando a estrutura das páginas.</p>
```

Nesse exemplo:

- **<p>** abre o parágrafo.
- O texto é o conteúdo.
- **</p>** fecha o parágrafo.

O conjunto forma um elemento HTML.

## Elementos dentro de outros elementos

Um elemento pode conter outros elementos. No exemplo abaixo, **strong** indica que uma parte do texto tem maior importância:

```html
<p>Antes de continuar, <strong>salve o arquivo</strong>.</p>
```

O elemento que foi aberto dentro do parágrafo também foi fechado dentro dele. Manter essa organização facilita a leitura e evita estruturas incorretas.

## Elementos sem tag de fechamento

Alguns elementos não possuem conteúdo interno nem tag de fechamento. É o caso de **br**, usado para inserir uma quebra de linha:

```html
<p>
    Desenvolvimento web<br>
    Turma de informática
</p>
```

O **br** é útil quando a quebra faz parte do conteúdo. Para separar assuntos em parágrafos, utilize elementos **p** diferentes.

A indentação do código ajuda a enxergar quais elementos estão dentro dos outros.