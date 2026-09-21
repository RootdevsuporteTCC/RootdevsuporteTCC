---
categoria: javascript
topico: saida-de-dados
---

# SAÍDA DE DADOS (OUTPUT)

Como fazemos o JavaScript "falar" conosco ou mostrar informações na tela? Existem algumas formas principais de exibir dados.

## 1. Escrevendo no HTML (`innerHTML`)

Esta é a forma mais comum de alterar o conteúdo do seu site. Você acessa um elemento HTML e muda o que está escrito dentro dele.

```javascript
// Procura um elemento com o id "demo" e muda o texto dele
document.getElementById("demo").innerHTML = "Olá, Mundo!";
```

## 2. Caixa de Alerta (`alert`)

O `alert()` cria uma daquelas caixinhas pop-up no navegador que pausam a tela e exigem que o usuário clique em "OK".

```javascript
alert("Bem-vindo ao ROOT DEV!");
```
*Dica: Use com moderação, pois alertas em excesso irritam os usuários.*

## 3. O Console do Navegador (`console.log`)

Esta é a ferramenta **mais importante** para você que está aprendendo a programar. O `console.log()` não mostra nada para o usuário comum, ele imprime mensagens secretas no painel de desenvolvedor do navegador. É perfeito para testar se o seu código está funcionando!

```javascript
console.log("O cálculo foi feito com sucesso!");
```

**Como abrir o console:** No seu navegador (Chrome, Edge, etc), aperte a tecla **F12** no teclado e clique na aba **"Console"**. É lá que essas mensagens aparecerão.