---
categoria: html
topico: atributos-html
---

# ATRIBUTOS HTML

Os atributos fornecem **informações adicionais** sobre os elementos HTML. Eles são como "configurações extras" que você passa para a tag.

## Regras dos Atributos
1. Todo atributo é sempre colocado na **Tag de Abertura**.
2. Eles geralmente vêm em pares de nome e valor: `nome="valor"`.

## Exemplos de Atributos Comuns

### O atributo `href`
Usado na tag de link (`<a>`). Ele diz ao navegador para qual endereço de internet (URL) o usuário deve ser levado quando clicar no link.

```html
<a href="https://www.google.com">Clique aqui para ir ao Google</a>
```

### O atributo `src`
Usado na tag de imagem (`<img>`). "Src" vem de *source* (fonte/origem). Ele indica o caminho onde a imagem está guardada para que o navegador possa carregá-la.

```html
<img src="foto-do-gato.jpg">
```

### O atributo `alt`
Também usado na tag de imagem. Ele fornece um "texto alternativo". Se a imagem der erro e não carregar, ou se um usuário com deficiência visual estiver usando um leitor de tela, esse é o texto que será lido/exibido.

```html
<img src="foto-do-gato.jpg" alt="Um gato laranja dormindo no sofá">
```

### Os atributos `class` e `id`
Você usará esses dois com muita frequência quando for aprender CSS! Eles servem para dar "nomes" ou "etiquetas" aos seus elementos HTML, para que você possa localizá-los e mudá-los de cor ou tamanho depois.

```html
<p class="texto-vermelho">Este texto ficará vermelho no CSS.</p>
```