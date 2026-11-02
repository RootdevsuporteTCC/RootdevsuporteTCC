// guarda a promise para compartilhar a consulta entre os scripts da página
let consultaSessao = null

// consulta o servidor sem reutilizar o cache do navegador
async function buscarSessao() {
    const resposta = await fetch("/usuarios/sessao", {
        cache: "no-store",
        headers: {
            Accept: "application/json"
        }
    })

    if (!resposta.ok) {
        throw new Error("Não foi possível verificar a sessão.")       
    }

    return resposta.json()
}

// reaproveita a consulta ou busca dados novos quando atualizar recebe true
export async function consultarSessao(atualizar = false) {
    if (!consultaSessao || atualizar) {
        consultaSessao = buscarSessao()
    }

    // guarda a consulta desta chamada mesmo se outra atualização começar
    const consultaAtual = consultaSessao

    try {
        return await consultaAtual
    } catch (erro) {
        // limpa a consulta que falhou sem apagar uma mais recente
        if (consultaSessao === consultaAtual) {
            consultaSessao = null
        }

        throw erro
    }
}