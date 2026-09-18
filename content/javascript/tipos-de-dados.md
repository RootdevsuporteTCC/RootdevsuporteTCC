---
categoria: javascript
topico: tipos-de-dados
---

# TIPOS DE DADOS

Quando guardamos informações em variáveis, o JavaScript reconhece automaticamente qual é o **tipo** daquele dado. Entender os tipos é crucial para que a programação funcione corretamente.

Os três tipos de dados mais fundamentais para iniciantes são:

## 1. Strings (Textos)

Uma String é uma sequência de caracteres (texto). Para o JavaScript entender que algo é um texto, o valor **deve estar entre aspas** (simples `''` ou duplas `""`).

```javascript
let nome = "Matheus"; // Aspas duplas
let sobrenome = 'Madeira'; // Aspas simples (também funciona)
let idadeFalsa = "18"; // Cuidado! Como tem aspas, o JS acha que é um texto, não um número.
```

## 2. Numbers (Números)

No JavaScript, números são escritos **sem aspas**. Diferente de outras linguagens, o JS usa o mesmo tipo para números inteiros (10, 20) e números com vírgula/decimais (10.5).
*Importante: na programação, usamos ponto `.` em vez de vírgula `,` para separar casas decimais.*

```javascript
let idade = 18;
let preco = 99.90; // Usando ponto!

// Você pode fazer matemática com Numbers:
let total = 10 + 5; // O total será 15
```

## 3. Booleans (Verdadeiro ou Falso)

Um Booleano só pode ter dois valores: `true` (verdadeiro) ou `false` (falso). 
Eles são escritos sem aspas. São muito usados para criar condições lógicas e testar coisas (ex: "o usuário está logado?").

```javascript
let luzLigada = true;
let maiorDeIdade = false;
```