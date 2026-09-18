---
categoria: html
topico: titulos-e-paragrafos
---

# TÍTULOS E PARÁGRAFOS

Escrever textos é a base de qualquer site na internet. O HTML tem tags específicas para organizar a hierarquia das suas informações.

## Títulos (Headings)

O HTML possui 6 níveis de títulos, que vão do `<h1>` ao `<h6>`.
A letra "h" vem da palavra inglesa *Heading* (Cabeçalho/Título).

* O `<h1>` é o título mais importante, geralmente o nome do seu site ou o assunto principal da página. Você deve tentar usar apenas um `<h1>` por página.
* O `<h2>` é um subtítulo principal.
* O `<h3>` é o subtítulo do subtítulo, e assim por diante.

O navegador, por padrão, já deixa o `<h1>` com letras bem grandes e em negrito, diminuindo o tamanho até chegar no `<h6>`.

```html
<h1>Este é o Título Principal 1</h1>
<h2>Este é o Subtítulo 2</h2>
<h3>Este é o Subtítulo 3</h3>
<h4>Este é o Subtítulo 4</h4>
<h5>Este é o Subtítulo 5</h5>
<h6>Este é o Subtítulo 6 (o menor)</h6>
```

## Parágrafos

Para escrever blocos de texto normais, usamos a tag `<p>` (de *Paragraph*). 

O navegador sempre adiciona automaticamente um pequeno espaço em branco antes e depois de um parágrafo para que o texto não fique grudado no próximo elemento.

```html
<p>Este é um parágrafo longo onde eu posso escrever sobre qualquer assunto. O HTML cuidará de organizar esse bloco de texto de forma legível na tela do usuário.</p>

<p>Este é outro parágrafo. Note que haverá um pequeno espaço entre ele e o parágrafo de cima.</p>
```