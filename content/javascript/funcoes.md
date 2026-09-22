---
categoria: javascript
topico: funcoes
---

# Funções

Uma função reúne instruções para realizar uma tarefa. Depois de definida, ela pode ser chamada em diferentes partes do código.

## Criando uma função

```javascript
function calcularRestantes(total, concluidas) {
    return total - concluidas
}

const restantes = calcularRestantes(8, 3)

console.log(restantes)
```

O resultado apresentado no console será **5**.

## Entendendo o exemplo

- **function:** inicia a declaração da função.
- **calcularRestantes:** é o nome escolhido.
- **total** e **concluidas:** são os parâmetros que recebem os valores.
- **return:** devolve o resultado para o código que chamou a função.

Na chamada **calcularRestantes(8, 3)**, os valores **8** e **3** são os argumentos.

O valor retornado é guardado na variável **restantes**.

## Reutilizando a função

```javascript
console.log(calcularRestantes(12, 7))
console.log(calcularRestantes(6, 6))
```

A mesma função calcula resultados para valores diferentes.

## Função sem retorno explícito

Uma função também pode executar uma ação sem utilizar **return**:

```javascript
function mostrarAviso() {
    console.log("Salve suas anotações antes de sair.")
}

mostrarAviso()
```

A declaração prepara a função. A chamada com **()** executa suas instruções.

Quando não há um retorno explícito, o valor retornado é **undefined**.