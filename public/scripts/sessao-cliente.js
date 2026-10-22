let consultaSessao = null

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

export async function consultarSessao(atualizar = false) {
    if (!consultaSessao || atualizar) {
        consultaSessao = buscarSessao()
    }

    const consultaAtual = consultaSessao

    try {
        return await consultaAtual
    } catch (erro) {
        if (consultaSessao === consultaAtual) {
            consultaSessao = null
        }

        throw erro
    }
}