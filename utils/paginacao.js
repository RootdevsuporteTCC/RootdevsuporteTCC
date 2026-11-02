// define a quantidade exibida nas consultas de usuários comentários e logs
const LIMITE_POR_PAGINA = 10

// valida a pesquisa e a página e retorna null quando os parâmetros são inválidos
function lerConsulta(query) {
    const pesquisa = query.pesquisa ?? ""
    const paginaRecebida = query.pagina ?? "1"

    if (typeof pesquisa !== "string" || typeof paginaRecebida !== "string" || !/^\d+$/.test(paginaRecebida)) {
        return null
    }

    const pagina = Number(paginaRecebida)
    const deslocamento = (pagina - 1) * LIMITE_POR_PAGINA

    // recusa páginas menores que um e valores fora da faixa segura do javascript
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

// monta a resposta e limita a lista à quantidade definida por página
function montarPagina(nomeCampo, registros, consulta) {
    return {
        [nomeCampo]: registros.slice(0, consulta.limite),
        pagina: consulta.pagina,
        // o registro extra indica que existe uma próxima página
        temProxima: registros.length > consulta.limite
    }
}

module.exports = {
    lerConsulta,
    montarPagina
}