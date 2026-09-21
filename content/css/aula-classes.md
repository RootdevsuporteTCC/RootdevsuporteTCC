---
categoria: css
topico: Aula-Classes
---

# CLASSES NO CSS

As **classes** no CSS são como etiquetas que você cola nos seus elementos HTML. Diferente de um ID (`id=""`), que deve ser único para um único elemento na página, você pode aplicar a **mesma classe** em vários elementos diferentes.

Isso é incrível porque permite dar a eles o mesmo visual de uma só vez, economizando muitas linhas de código!

## Como criar e usar uma classe?

Para selecionar uma classe no CSS, nós escrevemos um **ponto (`.`)**, seguido do nome da classe que inventamos.

Veja o exemplo no **HTML**:

```html
<!-- Estes dois cartões usarão a mesma estilização -->
<div class="cartao">
    <p class="texto-destaque">Olá, mundo!</p>
</div>

<div class="cartao">
    <p class="texto-destaque">Outro cartão aqui.</p>
</div>

<!-- Este elemento tem uma classe diferente -->
<div class="alerta">
    <p>Cuidado!</p>
</div>
```

Agora, veja como estilizamos no **CSS**:

```css
/* O ponto (.) indica que estamos buscando uma classe */
.cartao {
    background-color: #f1f1f1;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: 8px;
}

.texto-destaque {
    color: #4CAF50;
    font-weight: bold;
}

.alerta {
    background-color: #ff9999;
    padding: 15px;
}
```

## Várias Classes no mesmo elemento

Você também pode colocar mais de uma classe no mesmo elemento HTML. Basta separar os nomes com um **espaço**.

```html
<!-- Este botão recebe estilos da classe "btn" e da classe "btn-perigo" -->
<button class="btn btn-perigo">Excluir</button>
```

```css
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
}

.btn-perigo {
    background-color: red;
    color: white;
}
```

Dessa forma, você cria blocos de estilo como se fossem peças de Lego, juntando-os para montar o design perfeito!