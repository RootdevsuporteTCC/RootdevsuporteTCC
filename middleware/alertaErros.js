function alertaErros(req, res, next) {
    const enviarOriginal = res.send.bind(res)

    res.send = function (conteudo) {
        const querHtml = req.accepts(["json", "html"]) === "html"
        const respostaErro = res.statusCode >= 400

        if (!querHtml || !respostaErro) {
            return enviarOriginal(conteudo)
        }

        let dados = conteudo
        // o res.json tambem utiliza res.send internamente
        if (typeof conteudo === "string") {
            try {
                dados = JSON.parse(conteudo)
            } catch {
                dados = conteudo
            }
        }

        let mensagem = "Não foi possível concluir a operação"

        if (typeof dados === "string" && dados.trim()) {
            mensagem = dados
        } else if (dados && typeof dados.erro === "string") {
            mensagem = dados.erro
        }

        // prepara a mensagem para ser inserida no script
        const mensagemSegura = JSON.stringify(mensagem)
            .replace(/</g, "\\u003c")
            .replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029")

        res.removeHeader("Content-Length")
        res.removeHeader("ETag")
        res.set("Cache-Control", "no-store")
        res.type("html")

        return enviarOriginal(`
            <!DOCTYPE html>
            <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>ROOT DEV - Aviso</title>
                </head>
                <body>
                    <script>
                        alert(${mensagemSegura});

                        if (window.history.length > 1) {
                            window.history.back();
                        } else {
                            window.location.replace("/");
                        }
                    </script>

                    <noscript>
                        <p>Não foi possível concluir a operação.</p>
                        <a href="/">Voltar ao início</a>
                    </noscript>
                </body>
            </html>
        `)
    }

    next()
}

module.exports = alertaErros