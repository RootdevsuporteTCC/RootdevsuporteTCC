---
categoria: html
topico: atributos-html
---

# Atributos HTML

Os atributos acrescentam informações aos elementos. Eles são escritos na tag de abertura, normalmente no formato **nome="valor"**.

```html
<a href="https://www.w3schools.com/">Consultar aulas</a>
```

O atributo **href** informa o destino do link. Já o texto entre as tags é o que aparece na página.

## Atributos de uma imagem

```html
<img src="imagens/computador.jpg" alt="Computador sobre uma mesa">
```

Nesse exemplo:

- **src:** indica o caminho da imagem.
- **alt:** fornece uma descrição alternativa para seu conteúdo.

O arquivo precisa existir no caminho informado para ser carregado.

## Identificando elementos

Os atributos **id** e **class** ajudam a selecionar elementos no CSS e no JavaScript.

```html
<h1 id="titulo-principal">Guia de estudos</h1>

<p class="aviso">Confira o conteúdo da próxima aula.</p>
<p class="aviso">Salve suas anotações.</p>
```

O **id** identifica um elemento e não deve se repetir na mesma página.

A **class** pode ser compartilhada por vários elementos. No exemplo, os parágrafos pertencem à classe **aviso**.

Esses nomes não mudam a aparência sozinhos. É necessário escrever regras CSS ou utilizar JavaScript para trabalhar com eles.