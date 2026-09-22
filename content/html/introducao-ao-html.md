---
categoria: html
topico: introducao-ao-html
---

# Introdução ao HTML

O HTML é uma linguagem de marcação usada para organizar o conteúdo de uma página. Com ele, podemos indicar títulos, parágrafos, imagens, links e outras partes do documento.

Sua função é definir a estrutura e o significado desses elementos. A aparência pode ser alterada com CSS, enquanto o JavaScript permite adicionar comportamentos.

## Estrutura de uma página

Crie um arquivo chamado **index.html** e coloque este conteúdo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Caderno de programação</title>
</head>
<body>
    <h1>Meus estudos</h1>
    <p>Nesta página, vou organizar o que aprendi sobre desenvolvimento web.</p>
</body>
</html>
```

Cada parte tem uma função:

- **DOCTYPE:** informa ao navegador que o documento utiliza HTML e permite a renderização no modo de padrões.
- **html:** envolve o documento. O atributo **lang** indica seu idioma.
- **head:** reúne informações sobre a página.
- **meta charset:** define a codificação dos caracteres, permitindo representar acentos corretamente.
- **title:** define o título mostrado na aba do navegador.
- **body:** contém o conteúdo apresentado na página.
- **h1:** representa o título principal.
- **p:** representa um parágrafo.

Depois de salvar, abra o arquivo no navegador para visualizar o resultado.