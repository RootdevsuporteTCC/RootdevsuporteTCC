---
categoria: javascript
topico: tipos-de-dados
---

# Tipos de dados

Os valores utilizados no JavaScript possuem tipos. Eles influenciam as operações que podem ser realizadas.

## Texto, número e booleano

```javascript
const titulo = "Introdução ao HTML"
const quantidade = 8
const progresso = 37.5
const concluido = false
```

- **String:** representa texto, como o valor de **titulo**.
- **Number:** representa números, incluindo valores com casas decimais.
- **Boolean:** representa **true** ou **false**.

No código, os números decimais utilizam **.**.

## Undefined e null

```javascript
let aulaSelecionada

const resultado = null
```

A variável **aulaSelecionada** está com o valor **undefined**, pois ainda não recebeu um valor.

O **null** pode ser utilizado para indicar intencionalmente a ausência de um valor.

## Objetos e arrays

```javascript
const aula = {
    titulo: "Listas",
    categoria: "HTML"
}

const categorias = ["HTML", "CSS", "JavaScript"]
```

O objeto reúne propriedades. O array organiza uma sequência de valores e é um tipo de objeto.

## Texto não é número

```javascript
console.log(20 + 4)
console.log("20" + 4)
```

O primeiro resultado é **24**. O segundo é o texto **"204"**, pois o operador **+** também pode juntar textos.

Por isso, confira o tipo dos dados antes de fazer cálculos.