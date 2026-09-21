---
categoria: javascript
topico: condicionais
---

# CONDICIONAIS (IF / ELSE)

Os computadores não são inteligentes sozinhos; precisamos ensinar a eles como tomar decisões. Para isso usamos as estruturas **condicionais**. Elas dizem ao programa: *"SE isso for verdade, faça aquilo. SE NÃO, faça outra coisa"*.

## O comando `if` (SE)

A palavra `if` testa se uma condição é verdadeira (`true`). Se for, o código dentro das chaves `{}` será executado.

```javascript
let hora = 10;

// Se a hora for menor que 12...
if (hora < 12) {
  console.log("Bom dia!"); // Isso será impresso!
}
```

## O comando `else` (SE NÃO)

O `else` serve para capturar o caso contrário. Se a condição do `if` for falsa, o programa pula o `if` e executa o bloco do `else`.

```javascript
let idade = 15;

if (idade >= 18) {
  // O código não passa por aqui, porque 15 não é maior ou igual a 18
  console.log("Pode entrar na festa."); 
} else {
  // O programa cai direto aqui!
  console.log("Entrada proibida. Volte para casa.");
}
```

## O comando `else if` (SE NÃO, SE...)

Para testar várias condições seguidas, usamos o `else if`.

```javascript
let hora = 15;

if (hora < 12) {
  console.log("Bom dia!");
} else if (hora < 18) {
  console.log("Boa tarde!"); // Esta será a condição verdadeira!
} else {
  console.log("Boa noite!");
}
```

Com o `if`, `else if` e `else`, você controla exatamente como seu site deve reagir em qualquer situação possível!