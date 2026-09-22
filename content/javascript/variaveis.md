---
categoria: javascript
topico: variaveis
---

# Variáveis

As variáveis permitem guardar valores e utilizá-los durante a execução do código.

## Usando let

Utilize **let** quando precisar atribuir outro valor à variável:

```javascript
let aulasConcluidas = 2

aulasConcluidas = 3

console.log(aulasConcluidas)
```

O console apresenta **3**, que é o valor atribuído por último.

## Usando const

Utilize **const** quando não precisar substituir o valor atribuído à variável:

```javascript
const nomeDoCurso = "Desenvolvimento web"

console.log(nomeDoCurso)
```

Uma variável declarada com **const** precisa receber um valor na declaração. Tentar atribuir outro valor a ela provoca um erro.

## Const e objetos

O **const** não torna um objeto imutável:

```javascript
const perfil = {
    nome: "Ana"
}

perfil.nome = "Marina"

console.log(perfil.nome)
```

A propriedade **nome** foi alterada, mas a variável continua apontando para o mesmo objeto.

O que não seria permitido é substituir **perfil** por outro objeto.

## Nomes das variáveis

Use nomes que indiquem o conteúdo guardado, como **nomeDoCurso** ou **aulasConcluidas**.

Os nomes diferenciam letras maiúsculas de minúsculas e não podem começar com um número.

Também existe **var**, comum em códigos antigos, mas nos exemplos utilizaremos **let** e **const**.