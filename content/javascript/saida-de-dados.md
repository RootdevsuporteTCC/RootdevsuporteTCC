---
categoria: javascript
topico: saida-de-dados
---

# Saída de dados

A saída de dados é a apresentação de uma informação produzida pelo código. No navegador, podemos mostrar um resultado na página, no console ou em uma caixa de alerta.

## Mostrando na página

Coloque este exemplo dentro do **body**:

```html
<p id="resultado"></p>

<script>
    const resultado = document.getElementById("resultado")
    const aulasConcluidas = 5

    resultado.innerText = "Aulas concluídas: " + aulasConcluidas
</script>
```

O **getElementById** seleciona o parágrafo. O **innerText** define o texto apresentado nele.

O operador **+** junta a mensagem com o valor da variável.

## Mostrando no console

```javascript
const aulasConcluidas = 5

console.log("Aulas concluídas:", aulasConcluidas)
```

O console fica nas ferramentas de desenvolvedor do navegador. Ele ajuda a acompanhar valores e investigar problemas no código.

Essas informações não são secretas. Qualquer pessoa com acesso à página pode abrir o console.

## Mostrando um alerta

```javascript
alert("As alterações foram salvas.")
```

O alerta abre uma caixa de mensagem e interrompe a interação com a página até ser fechado.

Para mensagens frequentes, geralmente é mais adequado utilizar um elemento da própria página, como um parágrafo.