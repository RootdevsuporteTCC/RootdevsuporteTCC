---
categoria: css
topico: box-model
---

# Box Model

O Box Model descreve as partes da caixa de um elemento:

- **Conteúdo:** área ocupada pelo texto, imagem ou outros elementos.
- **Padding:** espaço entre o conteúdo e a borda.
- **Border:** borda ao redor dessa área.
- **Margin:** espaço externo à borda.

## Calculando a largura

Considere este HTML:

```html
<div class="caixa">Anotações da aula</div>
```

E este CSS:

```css
.caixa {
    box-sizing: content-box;
    width: 240px;
    padding: 16px;
    border: 2px solid #650080;
    margin: 12px;
}
```

Com **content-box**, a largura de **240px** corresponde apenas ao conteúdo.

A largura até as bordas será:

**240 + 16 + 16 + 2 + 2 = 276px**

As margens ficam fora dessa medida.

## Utilizando border-box

Substitua a regra anterior por:

```css
.caixa {
    box-sizing: border-box;
    width: 240px;
    padding: 16px;
    border: 2px solid #650080;
    margin: 12px;
}
```

Agora, os **240px** já incluem o conteúdo, o padding e as bordas. A área disponível para o conteúdo diminui, mas a largura definida é mantida.

A margem continua fora desse cálculo.

Essa diferença ajuda a entender por que um elemento pode ocupar mais espaço do que o esperado.