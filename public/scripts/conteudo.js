const form = {
    matterTitle: document.getElementById("matter-tittle"),
    topicsList: document.getElementById("topics-list"),
    lessonContent: document.getElementById("lesson-content"),
    commentsContainer: document.getElementById("comments-container"),
}

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