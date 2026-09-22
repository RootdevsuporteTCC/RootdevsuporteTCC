---
categoria: javascript
topico: introducao-ao-javascript
---

# Introdução ao JavaScript

O JavaScript é uma linguagem de programação. No navegador, ele permite responder a ações do usuário, realizar cálculos e alterar o conteúdo da página.

Enquanto o HTML organiza os elementos e o CSS define sua aparência, o JavaScript pode controlar seu comportamento.

## Alterando um texto

Coloque este exemplo dentro do **body** de um arquivo HTML:

```html
<p id="mensagem">Aguardando atualização.</p>

<script>
    const mensagem = document.getElementById("mensagem")

    mensagem.innerText = "A página foi atualizada pelo JavaScript."
</script>
```

O código procura o elemento que possui **id="mensagem"** e guarda sua referência na variável **mensagem**.

Depois, a propriedade **innerText** recebe o texto que será mostrado no parágrafo.

O script foi colocado depois do elemento para que ele já exista quando o JavaScript for executado.

## O que pode ser feito

Alguns usos comuns são:

- Mostrar e esconder partes da página.
- Atualizar informações após um clique.
- Conferir campos de formulários.
- Buscar informações de um servidor.

As verificações feitas no navegador ajudam o usuário, mas um sistema também precisa validar no servidor os dados que recebe.