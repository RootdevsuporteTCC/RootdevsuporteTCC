---
categoria: html
topico: titulos-e-paragrafos
---

# Títulos e parágrafos

Os títulos organizam as seções da página. O HTML possui níveis de **h1** até **h6**, que indicam a hierarquia do conteúdo.

Uma organização comum é usar **h1** para o assunto principal, **h2** para suas seções e **h3** para subdivisões dessas seções.

## Organizando o texto

Coloque este exemplo dentro do **body**:

```html
<h1>Guia de desenvolvimento web</h1>

<p>Este guia apresenta os assuntos estudados durante o curso.</p>

<h2>HTML</h2>

<p>O HTML organiza os elementos de uma página.</p>

<h3>Elementos de texto</h3>

<p>Títulos e parágrafos ajudam a separar as informações.</p>

<h2>CSS</h2>

<p>O CSS permite alterar a apresentação desses elementos.</p>
```

Os títulos devem representar a organização do conteúdo. Não escolha um nível apenas pelo tamanho que ele apresenta no navegador, pois a aparência pode ser ajustada com CSS.

## Escrevendo parágrafos

Cada elemento **p** representa um parágrafo.

Quebrar linhas ou inserir vários espaços no código não garante que esses espaços apareçam da mesma forma na página. No comportamento padrão, o navegador reúne os espaços em branco do texto.

Para começar outro parágrafo, escreva outro elemento **p**.