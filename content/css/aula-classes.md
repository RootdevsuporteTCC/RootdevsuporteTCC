---
categoria: css
topico: aula-classes
---

# Classes no CSS

Uma classe permite aplicar o mesmo estilo a vários elementos. Seu nome é definido no atributo **class** do HTML e utilizado no CSS com **.** antes dele.

## Reutilizando um estilo

No HTML:

```html
<div class="cartao">
    <h2>HTML</h2>
    <p>Organização do conteúdo.</p>
</div>

<div class="cartao">
    <h2>CSS</h2>
    <p>Apresentação da página.</p>
</div>
```

No CSS:

```css
.cartao {
    background-color: #eeeeee;
    padding: 16px;
    margin-bottom: 12px;
}
```

Os elementos com a classe **cartao** recebem as mesmas regras. Não é necessário repetir o CSS para cada bloco.

## Aplicando várias classes

Um elemento pode receber mais de uma classe. Os nomes são separados por espaços:

```html
<div class="cartao destaque">
    <h2>JavaScript</h2>
    <p>Interações com a página.</p>
</div>
```

Adicione ao CSS:

```css
.destaque {
    border: 2px solid #650080;
}
```

Esse elemento recebe as regras de **cartao** e de **destaque**.

Use nomes relacionados à função do elemento, como **aviso**, **menu** ou **cartao**. Isso facilita a leitura do código e evita nomes que deixam de fazer sentido quando a aparência muda.