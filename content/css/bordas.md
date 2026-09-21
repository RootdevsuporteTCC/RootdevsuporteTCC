---
categoria: css
topico: Bordas
---

# BORDAS NO CSS

As bordas permitem colocar contornos ao redor dos seus elementos. O CSS oferece várias opções para personalizar essas linhas.

Para uma borda aparecer, você **precisa** definir o estilo dela usando a propriedade `border-style`.

## Propriedades da Borda

### 1. Estilo da Borda (`border-style`)
Define o tipo de linha. Valores comuns:
* `solid`: Linha contínua sólida.
* `dashed`: Linha tracejada.
* `dotted`: Linha pontilhada.
* `none`: Nenhuma borda.

### 2. Espessura da Borda (`border-width`)
Define a grossura da linha (em pixels, por exemplo).

### 3. Cor da Borda (`border-color`)
Define a cor.

```css
.caixa {
  border-style: solid;
  border-width: 3px;
  border-color: red;
}
```

## A propriedade abreviada (Shorthand)
Para não ter que escrever três linhas de código sempre que quiser uma borda, você pode juntar tudo na propriedade `border`:

```css
/* Espessura | Estilo | Cor */
.caixa {
  border: 3px solid red;
}
```

## Arredondando as bordas (`border-radius`)
Uma das propriedades mais adoradas no CSS moderno. Ela permite criar botões redondos ou cartões com cantos suaves.

```css
.botao {
  border: 2px solid black;
  border-radius: 10px; /* Arredonda os cantos */
}

.circulo-perfeito {
  width: 100px;
  height: 100px;
  background-color: blue;
  border-radius: 50%; /* 50% cria um círculo ou elipse */
}
```