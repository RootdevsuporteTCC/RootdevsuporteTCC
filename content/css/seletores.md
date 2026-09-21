---
categoria: css
topico: Seletores
---

# SELETORES CSS

Os seletores são usados para "encontrar" (ou selecionar) os elementos HTML que você deseja estilizar. Pense neles como o endereço que o CSS usa para saber quem vai receber a pintura nova.

Existem vários tipos de seletores, vamos conhecer os mais básicos:

## 1. Seletor de Elemento (ou Tag)

Seleciona todos os elementos HTML de um tipo específico. Por exemplo, se você quiser que todos os parágrafos (`<p>`) do site fiquem azuis.

```css
p {
  color: blue;
  text-align: center;
}
```

## 2. Seletor de ID

O ID é usado para selecionar um **único** elemento específico na página. Para selecionar um elemento com um ID específico, escreva o caractere **hash (`#`)** seguido do ID do elemento.

**No HTML:**
```html
<h1 id="titulo-principal">Bem-vindo ao ROOT DEV</h1>
```

**No CSS:**
```css
#titulo-principal {
  color: purple;
  font-size: 40px;
}
```
*Lembre-se: O ID deve ser único! Não use o mesmo ID para dois elementos.*

## 3. Seletor de Classe

Como vimos na aula de classes, seleciona elementos HTML que possuem um atributo de classe específico. Usa-se um **ponto (`.`)**.

```css
.destaque {
  background-color: yellow;
}
```

## 4. Seletor Universal

O seletor universal é representado por um **asterisco (`*`)** e seleciona **todos** os elementos da página. É muito usado para resetar margens.

```css
* {
  margin: 0;
  padding: 0;
}
```

## Agrupando Seletores

Se você tem elementos diferentes que terão o mesmo estilo, pode agrupá-los separando por **vírgulas**, para não repetir código.

```css
h1, h2, p {
  color: green;
}
```