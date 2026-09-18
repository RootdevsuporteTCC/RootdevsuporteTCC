---
categoria: html
topico: imagens
---

# IMAGENS NO HTML

As imagens tornam o design da sua página muito mais atraente. No HTML, inserimos imagens usando a tag **`<img>`**.

A tag `<img>` é um **elemento vazio**, ou seja, ela contém apenas atributos e não possui uma tag de fechamento `</img>`.

## Sintaxe da Imagem

Para a imagem aparecer, precisamos de pelo menos dois atributos essenciais: o `src` e o `alt`.

```html
<img src="caminho/para/imagem.jpg" alt="Descrição da imagem">
```

### O Atributo `src` (Source)
Diz ao navegador onde a imagem está salva. Existem duas formas de puxar uma imagem:

1. **URL Absoluta:** Pegando uma imagem diretamente da internet.
```html
<img src="https://site.com/foto-de-paisagem.jpg" alt="Paisagem de montanha">
```

2. **Caminho Relativo (Mais recomendado):** Guardando a imagem em uma pasta dentro do seu próprio projeto (ex: criando uma pasta `img`).
```html
<img src="img/minha-foto.png" alt="Minha foto de perfil">
```

### O Atributo `alt` (Alternative Text)
Como vimos nas aulas anteriores, ele é fundamental para a acessibilidade. Descreve o que tem na imagem caso ela não carregue ou para usuários que usam leitores de tela.

## Controlando o tamanho no HTML

Você pode usar os atributos `width` (largura) e `height` (altura) para definir o tamanho da imagem, informando os valores em pixels (não precisa escrever "px", apenas o número).

```html
<img src="logo.png" alt="Logo do site" width="200" height="100">
```

*Dica de Ouro:* Embora o HTML permita alterar o tamanho, o mais correto e profissional hoje em dia é usar o **CSS** para controlar as larguras e alturas das suas imagens!