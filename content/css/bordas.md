---
categoria: css
topico: bordas
---

# Bordas

As bordas delimitam a área de um elemento. Podemos definir sua espessura, seu estilo e sua cor.

No HTML:

```html
<p class="aviso">O prazo para enviar a atividade termina amanhã.</p>
```

No CSS:

```css
.aviso {
    border: 2px solid #650080;
    padding: 16px;
}
```

A propriedade **border** reúne 3 valores:

- **2px:** espessura da borda.
- **solid:** linha contínua.
- **#650080:** cor da borda.

O **padding** cria um espaço entre o texto e a borda.

## Outros estilos

```css
.exemplo-tracejado {
    border: 2px dashed #650080;
}

.exemplo-pontilhado {
    border: 2px dotted #650080;
}
```

O valor **dashed** produz uma linha tracejada. O valor **dotted** produz uma linha pontilhada.

## Alterando apenas um lado

```css
h2 {
    border-bottom: 2px solid #650080;
}
```

Nesse caso, a borda aparece apenas na parte inferior do título.

## Arredondando os cantos

```css
.aviso {
    border: 2px solid #650080;
    border-radius: 8px;
    padding: 16px;
}
```

A propriedade **border-radius** arredonda os cantos. Ela também pode ser usada em elementos com fundo colorido, mesmo que não exista uma borda visível.