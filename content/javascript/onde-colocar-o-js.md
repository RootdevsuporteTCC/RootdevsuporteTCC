---
categoria: javascript
topico: onde-colocar-o-js
---

# Onde colocar o JavaScript

O JavaScript pode ser escrito dentro do HTML ou em um arquivo separado.

## Código dentro do HTML

Utilize o elemento **script**:

```html
<body>
    <p id="mensagem">Texto inicial.</p>

    <script>
        const mensagem = document.getElementById("mensagem")

        mensagem.innerText = "Texto atualizado."
    </script>
</body>
```

Nesse exemplo, o script aparece depois do parágrafo. Assim, o elemento já está disponível quando o código procura por ele.

## Arquivo separado

Crie um arquivo chamado **script.js**:

```javascript
const mensagem = document.getElementById("mensagem")

mensagem.innerText = "Texto atualizado pelo arquivo externo."
```

No **head** do HTML, adicione:

```html
<script src="script.js" defer></script>
```

Mantenha o parágrafo dentro do **body**:

```html
<p id="mensagem">Texto inicial.</p>
```

O **src** informa o caminho do arquivo.

Para esse script externo, o **defer** permite que o navegador baixe o arquivo enquanto lê o HTML e execute o código depois que o documento terminar de ser analisado.

Isso evita tentar selecionar elementos que ainda não foram criados.

Dentro do arquivo **.js**, escreva apenas JavaScript, sem as tags **script**.