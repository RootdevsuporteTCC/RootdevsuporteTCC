const form = {
    matterTitle: document.getElementById("matter-title"), // corrigido de matter-tittle
    topicsList: document.getElementById("topics-list"),
    lessonContent: document.getElementById("lesson-content"),
    commentsContainer: document.getElementById("comments-container"),
}

// Renomeado de toggleMenu para btnMenuLateral para evitar conflito
const btnMenuLateral = document.getElementById('toggle-menu');
const aside = document.querySelector('aside');
const arrow = document.getElementById('arrow');

// Adicione o evento de clique na nova variável
btnMenuLateral.addEventListener('click', () => {
    aside.classList.toggle('fechado');
    
    if (aside.classList.contains('fechado')) {
        arrow.className = 'fa-solid fa-chevron-left';
    } else {
        arrow.className = 'fa-solid fa-chevron-right';
    }
});

const aulasPorMateria = {
    html: [
        {
            topico: "aula-flexbox",
            titulo: "Como centralizar uma div"
        },
        {
            topico: "exemplo-legal",
            titulo: "aula de exemplo"
        }
    ],

    css: [
        {
            topico: "aula-classes",
            titulo: "Introdução a Classes"
        },
        {
            topico: "aula-jonas",
            titulo: "Jonas Arruda"
        }
    ],

    javascript: []
}


const parametros = new URLSearchParams(window.location.search)

const categoria = parametros.get("categoria")
const topicoAtual = parametros.get("topico")



function carregarMenuEsquerdo() {
    const aulas = aulasPorMateria[categoria]

    if (!aulas) {
        form.topicsList.innerHTML = ""
        return
    }

    form.topicsList.innerHTML = ""

    aulas.forEach(aula => {
        const li = document.createElement("li")
        li.innerText = aula.titulo
        li.onclick = () => {
            window.location.href = `conteudo.html?categoria=${categoria}&topico=${aula.topico}`
        }

        form.topicsList.appendChild(li)
    });
}


async function carregarConteudo() {
    try {
        const resposta = await fetch(`/conteudo/${encodeURIComponent(categoria)}/${encodeURIComponent(topicoAtual)}`)
        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.erro)
        }

        const html = marked.parse(dados.conteudo)

        form.lessonContent.innerHTML = html

        carregarTitulo()

        carregarComentarios(dados.comentarios)
    } catch (erro) {
        console.log("Erro ao carregar conteudo:", erro)

        form.lessonContent.innerHTML = `
            <p>Erro ao carregar o conteúdo.</p>
        `

        form.commentsContainer.innerHTML = ""
    }
}

