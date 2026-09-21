---
categoria: html
topico: introducao-ao-html
---

# INTRODUÇÃO AO HTML

Bem-vindo ao início da sua jornada na programação web! 

O **HTML** (HyperText Markup Language, ou Linguagem de Marcação de Hipertexto) não é exatamente uma linguagem de programação, mas sim uma **linguagem de marcação**. Ele é usado para estruturar uma página web e seu conteúdo. 

Pense no HTML como o **esqueleto** da internet. É ele que diz ao navegador onde fica o título, onde fica o texto, onde colocar uma imagem e como organizar as informações mostradas na tela.

## A Estrutura Básica

Todo arquivo HTML precisa de uma estrutura padrão para que o navegador o entenda corretamente. Veja como ela funciona:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Minha Primeira Página</title>
</head>
<body>

    <h1>Olá, Mundo!</h1>
    <p>Este é o meu primeiro site usando HTML.</p>

</body>
</html>
```

### Entendendo o código passo a passo:

* `<!DOCTYPE html>`: Avisa ao navegador que estamos usando a versão mais recente do HTML (o HTML5).
* `<html>`: É o elemento raiz, ele "abraça" todo o código da sua página. O `lang="pt-BR"` indica que o site está em português do Brasil.
* `<head>`: É a "cabeça" do site. Aqui ficam as configurações invisíveis para o usuário, como o título da aba do navegador (`<title>`) e o conjunto de caracteres (`<meta charset="UTF-8">`, que permite o uso de acentos como "á", "ç").
* `<body>`: É o "corpo" do site. **Tudo** o que você quer que apareça na tela (textos, imagens, botões) deve ser escrito dentro do `<body>`.
* `<h1>` e `<p>`: São as marcações (tags) para um Título Principal e um Parágrafo, respectivamente.