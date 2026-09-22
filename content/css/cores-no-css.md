---
categoria: css
topico: cores-no-css
---

# Cores no CSS

As cores podem ser aplicadas ao texto, ao fundo e às bordas de um elemento.

No HTML:

```html
<p class="aviso">Seu progresso foi salvo.</p>
```

No CSS:

```css
.aviso {
    color: #ffffff;
    background-color: #650080;
    border: 2px solid #330040;
}
```

Nesse exemplo:

- **color:** altera a cor do texto.
- **background-color:** altera a cor do fundo.
- **border:** define a espessura, o estilo e a cor da borda.

## Formas de representar cores

O CSS aceita diferentes formatos:

```css
h1 {
    color: purple;
}

h2 {
    color: #650080;
}

h3 {
    color: rgb(101, 0, 128);
}
```

O primeiro exemplo utiliza um nome de cor.

O formato hexadecimal começa com **#**. Na forma com 6 dígitos, os pares representam vermelho, verde e azul.

No formato **rgb**, esses componentes podem ser informados com valores de **0** a **255**.

## Transparência

O formato **rgba** acrescenta um valor de transparência:

```css
.caixa {
    background-color: rgba(101, 0, 128, 0.2);
}
```

O último valor vai de **0**, totalmente transparente, até **1**, totalmente opaco.

Ao combinar cores, verifique se o texto continua fácil de ler sobre o fundo escolhido.