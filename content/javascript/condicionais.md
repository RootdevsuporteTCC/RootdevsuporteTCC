---
categoria: javascript
topico: condicionais
---

# Condicionais

As condicionais permitem executar partes diferentes do código conforme uma condição.

## If e else

```javascript
const possuiAnotacoes = true

if (possuiAnotacoes) {
    console.log("As anotações estão disponíveis.")
} else {
    console.log("Ainda não há anotações.")
}
```

O **if** verifica a condição. Se ela for verdadeira, o primeiro bloco é executado.

O **else** define o que será executado quando a condição for falsa.

## Verificando outras possibilidades

```javascript
const aulasConcluidas = 3
const totalDeAulas = 8

if (aulasConcluidas === totalDeAulas) {
    console.log("Todas as aulas foram concluídas.")
} else if (aulasConcluidas > 0) {
    console.log("Os estudos estão em andamento.")
} else {
    console.log("Nenhuma aula foi concluída.")
}
```

O **else if** verifica outra condição quando a anterior não foi atendida.

Nessa estrutura, o código executa apenas o primeiro bloco cuja condição seja atendida. Se nenhuma for, executa o **else**.

## Operadores de comparação

Alguns operadores utilizados nas condições são:

- **===:** verifica igualdade de valor e tipo.
- **!==:** verifica diferença de valor ou tipo.
- **>:** maior que.
- **<:** menor que.
- **>=:** maior ou igual.
- **<=:** menor ou igual.

O **=** atribui um valor. Ele não deve ser confundido com **===**.