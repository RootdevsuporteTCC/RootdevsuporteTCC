---
categoria: css
topico: flexbox
---

# FLEXBOX (LAYOUTS MALEÁVEIS)

Antigamente, alinhar coisas na tela com CSS era uma dor de cabeça. Hoje, temos o **Flexbox** (Flexible Box Layout), um módulo do CSS desenhado especificamente para organizar elementos em colunas ou linhas, e distribuir espaço entre eles de forma inteligente.

## Transformando em Flex

Para começar a usar o Flexbox, você precisa dizer que um elemento "pai" (um container) terá o comportamento flex.

```css
.pai {
  display: flex;
}
```
Assim que você faz isso, todos os elementos filhos diretos dessa div ficam alinhados lado a lado, em uma linha!

## Alinhamento Horizontal (`justify-content`)
Essa propriedade alinha os itens no eixo principal (que por padrão é a horizontal).

```css
.pai {
  display: flex;
  justify-content: center; /* Centraliza tudo horizontalmente */
  /* Outras opções: flex-start, flex-end, space-between, space-around */
}
```

## Alinhamento Vertical (`align-items`)
Essa propriedade alinha os itens no eixo cruzado (que por padrão é a vertical).

```css
.pai {
  display: flex;
  height: 300px; /* Definindo uma altura para ver o efeito */
  align-items: center; /* Centraliza tudo verticalmente */
  /* Outras opções: flex-start, flex-end, stretch */
}
```

## O Truque de Ouro: Como centralizar qualquer coisa
Você lembra do esboço de "COMO CENTRALIZAR UMA DIV" na documentação do ROOT DEV? É assim que se faz hoje em dia de forma perfeita:

```html
<div class="pai">
    <div class="filha">Estou no meio!</div>
</div>
```

```css
.pai {
  display: flex;
  justify-content: center; /* Centro horizontal */
  align-items: center;     /* Centro vertical */
  height: 100vh; /* Ocupa 100% da altura da tela */
}

.filha {
  background-color: purple;
  color: white;
  padding: 20px;
}
```