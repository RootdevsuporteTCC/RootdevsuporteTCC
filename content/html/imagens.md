---
categoria: html
topico: imagens
---

# Imagens

O elemento **img** apresenta uma imagem na página. Ele não possui tag de fechamento.

```html
<img src="imagens/mesa.jpg" alt="Mesa de estudos com computador e caderno">
```

O **src** indica o caminho do arquivo. Nesse exemplo, a imagem **mesa.jpg** precisa estar dentro da pasta **imagens**, localizada ao lado do arquivo HTML.

O **alt** descreve o conteúdo da imagem. Esse texto pode ser utilizado por leitores de tela e quando a imagem não consegue ser carregada.

## Definindo as dimensões

Os atributos **width** e **height** informam a largura e a altura em pixels:

```html
<img
    src="imagens/mesa.jpg"
    alt="Mesa de estudos com computador e caderno"
    width="600"
    height="400"
>
```

O exemplo considera uma imagem com proporção de **600 por 400**. Use dimensões que respeitem a proporção do seu arquivo para evitar distorções.

## Adaptando à largura disponível

No CSS, podemos impedir que a imagem ultrapasse seu espaço:

```css
img {
    max-width: 100%;
    height: auto;
}
```

A largura máxima acompanha o elemento que contém a imagem. A altura automática mantém sua proporção.

Se a imagem não aparecer, confira o caminho, a extensão e o uso de letras maiúsculas e minúsculas no nome.