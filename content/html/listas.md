---
categoria: html
topico: listas
---

# Listas

As listas agrupam informações relacionadas. No HTML, podemos representar itens sem uma sequência obrigatória ou etapas que precisam seguir uma ordem.

## Lista não ordenada

O elemento **ul** representa uma lista em que a ordem dos itens não é essencial. Cada item fica dentro de um elemento **li**.

```html
<h2>Materiais para estudar</h2>

<ul>
    <li>Editor de texto</li>
    <li>Navegador</li>
    <li>Caderno de anotações</li>
</ul>
```

Por padrão, o navegador apresenta marcadores ao lado dos itens.

## Lista ordenada

O elemento **ol** representa uma sequência. Os itens também são escritos com **li**.

```html
<h2>Como visualizar uma página</h2>

<ol>
    <li>Escrever o código HTML.</li>
    <li>Salvar o arquivo.</li>
    <li>Abrir o arquivo no navegador.</li>
</ol>
```

Por padrão, os itens recebem uma numeração.

## Listas dentro de listas

Uma lista pode ficar dentro de um item de outra lista:

```html
<ul>
    <li>
        Conteúdos de HTML
        <ul>
            <li>Títulos</li>
            <li>Parágrafos</li>
        </ul>
    </li>
    <li>Conteúdos de CSS</li>
</ul>
```

Observe que a lista interna está dentro do **li** correspondente a **Conteúdos de HTML**.