---
categoria: html
topico: links
---

# Links

Os links permitem acessar outras páginas ou partes de um documento. Eles são criados com o elemento **a**, que utiliza o atributo **href** para definir o destino.

## Link para outro site

```html
<a href="https://www.w3schools.com/html/">Consultar o tutorial de HTML</a>
```

O texto deve ajudar a entender o destino do link.

## Link para um arquivo do projeto

```html
<a href="sobre.html">Sobre o projeto</a>
```

Esse caminho procura o arquivo **sobre.html** na mesma pasta da página atual.

Se o arquivo estiver dentro de outra pasta, inclua essa pasta:

```html
<a href="paginas/contato.html">Contato</a>
```

## Link para uma seção da página

Podemos usar **#** seguido do **id** de um elemento:

```html
<a href="#materiais">Ver materiais</a>

<h2 id="materiais">Materiais de estudo</h2>
<p>Aqui estão os materiais utilizados nas aulas.</p>
```

## Abrindo outro contexto de navegação

```html
<a
    href="https://www.w3schools.com/"
    target="_blank"
    rel="noopener"
>
    Abrir W3Schools
</a>
```

O **target="_blank"** solicita a abertura em outra aba ou janela, conforme o navegador. O **rel="noopener"** impede que a página aberta controle a página de origem pela referência de abertura.