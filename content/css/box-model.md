---
categoria: css
topico: box-model
---

# MODELO DE CAIXA (BOX MODEL)

O **CSS Box Model** (Modelo de Caixa) é o conceito mais importante para entender o layout no desenvolvimento web. 

Em HTML, **todo elemento é considerado uma caixa retangular**. O Box Model explica como o tamanho dessa caixa é calculado e como ela cria espaço ao seu redor.

O modelo é composto por quatro partes (de dentro para fora):

## 1. Conteúdo (Content)
É o núcleo da caixa, onde o texto, as imagens ou vídeos aparecem. 
O tamanho dele é definido pelas propriedades `width` (largura) e `height` (altura).

## 2. Preenchimento (Padding)
É o espaço em branco ao redor do conteúdo, **dentro** da borda. Ele empurra a borda para mais longe do texto.

## 3. Borda (Border)
Uma linha (visível ou invisível) que envolve o preenchimento e o conteúdo.

## 4. Margem (Margin)
O espaço em branco do lado de **fora** da borda. Ele empurra os outros elementos para longe. A margem é invisível.

---

### Exemplo Prático Visual:

Imagine um quadro na parede:
* O **Conteúdo** é a pintura em si.
* O **Padding** é a moldura de papelão branco ao redor da pintura.
* A **Border** é a moldura de madeira do quadro.
* A **Margin** é o espaço na parede que separa este quadro do quadro vizinho.

### Código de Exemplo:

```css
div {
  /* 1. Conteúdo */
  width: 300px;
  background-color: lightblue;
  
  /* 2. Preenchimento (espaço interno) */
  padding: 20px;
  
  /* 3. Borda */
  border: 5px solid blue;
  
  /* 4. Margem (espaço externo) */
  margin: 30px;
}
```

*Dica: Quando você define a largura (`width`) de um elemento, você está definindo apenas a largura do Conteúdo. Para saber o espaço total que o elemento ocupa na tela, você precisa somar width + padding esquerdo e direito + border esquerda e direita.*