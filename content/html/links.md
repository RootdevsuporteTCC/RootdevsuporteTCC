---
categoria: html
topico: links
---

# LINKS NO HTML

A capacidade de clicar em um texto e pular para outra página é a essência da "teia" da internet. No HTML, criamos links usando a tag **`<a>`** (que vem de *Anchor*, ou âncora).

## Como criar um Link Básico

A tag `<a>` precisa obrigatoriamente do atributo `href` (referência de hipertexto). É no `href` que você coloca a URL (o endereço) de destino. O texto que ficar no meio da tag será o texto clicável (geralmente azul e sublinhado).

```html
<a href="https://www.wikipedia.org">Acessar a Wikipedia</a>
```

## Abrindo links em uma nova aba

Por padrão, quando o usuário clica em um link, a nova página abre na mesma aba, substituindo o seu site. Se você quiser que o link abra em uma aba diferente (para que o usuário não feche seu site sem querer), use o atributo `target="_blank"`.

```html
<a href="https://www.google.com" target="_blank">Abrir Google em nova aba</a>
```

## Links Internos (Navegando no seu próprio site)

Você não precisa colocar a URL completa (`https://...`) se quiser fazer um link para outra página do seu próprio site que está na mesma pasta. Basta colocar o nome do arquivo.

Imagine que você criou um arquivo `sobre.html` na mesma pasta do seu `index.html`:

```html
<!-- Este link vai para a página Sobre do seu projeto -->
<a href="sobre.html">Leia mais sobre nós</a>
```

## Transformando uma imagem em link

Você pode transformar qualquer elemento em um link, até mesmo uma imagem. Basta colocar a tag de imagem *dentro* da tag de link:

```html
<a href="https://www.rootdev.com.br">
    <img src="logo.png" alt="Logo da Root Dev">
</a>
```