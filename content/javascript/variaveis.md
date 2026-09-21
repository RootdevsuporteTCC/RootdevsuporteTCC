---
categoria: javascript
topico: Variaveis
---

# VARIÁVEIS NO JAVASCRIPT

Pense nas variáveis como **caixas** onde você guarda informações (dados) para usar depois. Cada caixa precisa de uma "etiqueta" (um nome) para você saber o que tem lá dentro.

Existem três palavras especiais no JavaScript para criar essas caixas: `let`, `const` e `var`.

## 1. Criando com `let`

O `let` cria uma variável cujo valor **pode ser alterado** no futuro. É a forma mais comum de criar variáveis hoje em dia.

```javascript
// Criamos a variável "nome" e guardamos "Gabriel" nela
let nome = "Gabriel";

// Podemos mudar o valor depois!
nome = "Leonardo"; 
```

## 2. Criando com `const`

O `const` (constante) cria uma variável cujo valor **NUNCA pode ser alterado**. Se você tentar mudar, o JavaScript vai dar um erro. Use para valores fixos.

```javascript
const cpf = "123.456.789-00";
// cpf = "000.000.000-00"; -> ISSO DARÁ ERRO!
```

## 3. O antigo `var`

O `var` é a forma antiga de criar variáveis (antes de 2015). Você vai ver muito isso em códigos antigos na internet. Hoje em dia, os programadores preferem usar apenas `let` e `const` porque o `var` pode causar alguns bugs confusos.

### Regras para nomes de variáveis:
* Podem conter letras, números, sublinhados (`_`) e cifrões (`$`).
* **Devem** começar com uma letra (ou `$` / `_`). Nunca comece com um número!
* São sensíveis a maiúsculas e minúsculas (a variável `idade` é diferente de `Idade`).