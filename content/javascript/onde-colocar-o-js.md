---
categoria: javascript
topico: onde-colocar-o-js
---

# ONDE COLOCAR O JAVASCRIPT

Assim como o CSS, o código JavaScript precisa ser inserido ou conectado ao seu arquivo HTML para funcionar. 

No HTML, o código JavaScript deve ser colocado entre as tags **`<script>`** e **`</script>`**.

## 1. JavaScript Interno

Você pode escrever o código JavaScript diretamente dentro do seu arquivo HTML. O local mais recomendado para colocar a tag `<script>` é no final da tag `<body>`, logo antes de fechá-la. Isso garante que todo o HTML carregue antes do JavaScript tentar modificá-lo.

```html
<!DOCTYPE html>
<html>
<body>

  <h1>Meu Site</h1>
  <p>Bem-vindo!</p>

  <!-- O script vai aqui, no final do body -->
  <script>
    // Seu código JavaScript vem aqui!
  </script>

</body>
</html>
```

## 2. JavaScript Externo (Recomendado)

Assim como criamos pastas separadas para imagens, a melhor prática profissional é separar o código JS em seu próprio arquivo. Isso deixa o HTML mais limpo e permite reaproveitar o mesmo script em várias páginas.

1. Crie um arquivo chamado **`script.js`** na sua pasta de trabalho.
2. No seu arquivo HTML, chame o script usando o atributo `src` (source/origem):

```html
<!-- Chamando o arquivo externo no final do body -->
<script src="script.js"></script>
```

*Nota: O arquivo externo `.js` **não pode** conter a tag `<script>`. Lá dentro, você escreve apenas o código JavaScript puro.*