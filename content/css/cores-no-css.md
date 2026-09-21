---
categoria: css
topico: Cores-no-CSS
---

# CORES NO CSS

No CSS, dar vida aos elementos através das cores é uma das tarefas mais divertidas. Você pode mudar a cor do texto, a cor do fundo, a cor da borda, entre outras.

## Propriedades Principais

* `color`: Muda a cor do **texto**.
* `background-color`: Muda a cor do **fundo** de um elemento.

## Como definir as cores?

Existem três formas principais de escrever a cor que você deseja:

### 1. Nomes das Cores
O CSS suporta 140 nomes de cores padrão em inglês.

```css
h1 {
  background-color: Tomato;
  color: White;
}
```
*(Alguns exemplos: Red, Blue, Green, Yellow, Orange, Purple, Black, White)*

### 2. Cores HEX (Hexadecimais)
É o formato mais usado no desenvolvimento web. Começa com um `#` seguido por 6 letras/números que representam a mistura de Vermelho, Verde e Azul (RGB).

```css
p {
  color: #ff0000; /* Vermelho puro */
  background-color: #f1f1f1; /* Cinza claro */
}
```

### 3. Valores RGB e RGBA
O `rgb()` define a intensidade de Vermelho (Red), Verde (Green) e Azul (Blue) usando números de 0 a 255.
O `rgba()` é igual, mas o "A" significa *Alpha* (transparência), que vai de 0.0 (totalmente transparente) a 1.0 (totalmente sólido).

```css
.caixa-transparente {
  /* Vermelho com 50% de transparência */
  background-color: rgba(255, 0, 0, 0.5); 
}
```

Experimente misturar cores usando o formato HEX para deixar o design do seu site com uma cara super profissional!