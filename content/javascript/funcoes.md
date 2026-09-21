---
categoria: javascript
topico: Funcoes
---

# FUNÇÕES NO JAVASCRIPT

Uma função em JavaScript é um bloco de código projetado para executar uma tarefa específica. 

Pense nela como uma "receita" de bolo: você escreve as instruções uma vez e, depois, toda vez que quiser fazer o bolo, basta mandar "executar a receita", sem precisar escrever tudo de novo.

## Como criar uma Função?

Usamos a palavra `function`, seguida do **nome** que queremos dar, **parênteses `()`**, e chaves **`{}`**. O código que deve ser executado fica dentro das chaves.

```javascript
// Criando a função
function darBoasVindas() {
  console.log("Seja bem-vindo ao ROOT DEV!");
  console.log("Aproveite as aulas!");
}
```

## Como chamar (invocar) uma Função?

O código dentro de uma função não roda sozinho. Ele fica "adormecido" até que você chame a função pelo nome dela, usando os parênteses.

```javascript
// Chamando a função
darBoasVindas(); // Isso fará as mensagens aparecerem no console
```

## Funções com Parâmetros

A verdadeira mágica das funções é que você pode enviar informações para dentro delas através dos parênteses. Essas informações são chamadas de parâmetros ou argumentos.

```javascript
// Esta função recebe um "nome"
function saudarUsuario(nome) {
  alert("Olá, " + nome + "!");
}

saudarUsuario("Gabriel"); // A tela exibirá: Olá, Gabriel!
saudarUsuario("Leonardo"); // A tela exibirá: Olá, Leonardo!
```