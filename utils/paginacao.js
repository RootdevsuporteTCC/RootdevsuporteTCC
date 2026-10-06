const LIMITE_POR_PAGINA = 10

function lerConsulta(query) {
    const pesquisa = query.pesquisa ?? ""
    const paginaRecebida = query.pagina ?? "1"

    if (typeof pesquisa !== "string" || typeof paginaRecebida !== "string" || !/^\d+$/.test(paginaRecebida)) {
        return null
    }

    const pagina = Number(paginaRecebida)
    const deslocamento = (pagina - 1) * LIMITE_POR_PAGINA

    if (!Number.isSafeInteger(pagina) || pagina < 1 || !Number.isSafeInteger(deslocamento)) {
        return null
    }

    return {
        pesquisa,
        pagina,
        limite: LIMITE_POR_PAGINA,
        deslocamento
    }
}

function montarPagina(nomeCampo, registros, consulta) {
    return {
        [nomeCampo]: registros.slice(0, consulta.limite),
        pagina: consulta.pagina,
        temProxima: registros.length > consulta.limite
    }
}

module.exports = {
    lerConsulta,
    montarPagina
}