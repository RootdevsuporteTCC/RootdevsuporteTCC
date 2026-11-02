const usuarioService = require("../service/usuarioService")
const { compararHash } = require("../service/criptografiaService")
const autenticacaoService = require("../service/autenticacaoService")

const { encerrarSessao, iniciarSessao } = require("../utils/sessao")
const { normalizarUsuario } = require("../utils/normalizarUsuario")

const userModel = require('../model/userModel')
const logModel = require('../model/logModel')
const usuarioValidacao = require("../validacoes/usuarioValidacao")

// prepara e valida o cadastro antes de criar a conta pelo service
function criarUsuario(req, res) {

    // usa um objeto vazio se req.body retornar qualquer valor "falsy"
    const dados = req.body || {}

    const usuario = normalizarUsuario({
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        avatar: dados.avatar,
    })

    const erroValidacao = usuarioValidacao.validarDadosUsuario(usuario)

    if (erroValidacao) {
        return res.status(400).send(erroValidacao)
    }

    const confirmarSenha = dados["confirmar-senha"]

    const erroSenha = usuarioValidacao.validarSenha(usuario.senha, confirmarSenha)

    if (erroSenha) {
        return res.status(400).send(erroSenha)
    }

    // verifica se o nome ou o email já pertence a outra conta
    userModel.buscarUsuarioDuplicado(usuario, 0, (erroBusca, usuarios) => {
        if (erroBusca) {
            console.log("Erro ao verificar duplicidade:", erroBusca.code)

            return res.status(500).send("Não foi possível verificar os dados do cadastro.")
        }

        if (usuarios.length > 0) {
            return res.status(409).send("O nome de usuário ou e-mail já está cadastrado.")
        }

        usuarioService.criarUsuario(usuario, (erro, resultado) => {
            if (erro) {
                // trata também a duplicidade encontrada pelo banco na gravação
                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(409).send("O nome de usuário ou e-mail já está cadastrado.")
                }

                console.log("Erro ao cadastrar usuário:", erro.code)

                return res.status(500).send("Não foi possível cadastrar o usuário")
            }

            const log = {
                userId: resultado.insertId,
                acao: "Cadastro realizado"
            }

            return logModel.registrarLog(log, (erroLog) => {
                if (erroLog) {
                    console.log("Erro ao registrar o cadastro:", erroLog)
                }

                return res.redirect("/login.html")
            })
        })
    })
}

// autentica a conta pelo service e inicia a sessão antes de redirecionar
function loginUsuario(req, res, next) {
    const dados = req.body || {}

    autenticacaoService.autenticar(
        dados.login,
        dados.senha,
        false,
        (erro, resultado) => {
            if (erro) {
                return next(erro)
            }

            if (resultado.erro) {
                return res.status(resultado.status).json({ erro: resultado.erro })
            }

            iniciarSessao(req, resultado.usuario, (erroSessao) => {
                if (erroSessao) {
                    return next(erroSessao)
                }

                const log = {
                    userId: resultado.usuario.id,
                    acao: "Login realizado"
                }

                logModel.registrarLog(log, (erroLog) => {
                    if (erroLog) {
                        console.log("Erro ao registrar o login:", erroLog.code)
                    }

                    return res.redirect("/")
                })
            })
        }
    )
}

// encerra a sessão e registra a saída antes de voltar ao início
function logoutUsuario(req, res) {
    const usuario = req.session.usuario

    encerrarSessao(req, res, (erroSessao) => {
        if (erroSessao) {
            console.log("Erro ao encerrar a sessão:", erroSessao)

            return res.status(500).send("Erro ao fazer logout")
        }

        if (!usuario) {
            return res.redirect("/")
        }

        const log = {
            userId: usuario.id,
            acao: "Logout realizado"
        }

        return logModel.registrarLog(log, (erroLog) => {
            if (erroLog) {
                console.log("Erro ao registrar o logout:", erroLog)
            }

            return res.redirect("/")
        })
    })
}

// consulta a conta no banco e devolve o estado atual do login
function verificarSessao(req, res) {
    res.set("Cache-Control", "no-store") // impede o reaproveitamento da resposta pelo navegador

    if (!req.session.usuario) {
        return res.json({ logado: false })
    }

    const id = req.session.usuario.id

    userModel.buscarPorId(id, (erro, usuario) => {
        if (erro) {
            console.log("Erro ao consultar usuário da sessão", erro)

            return res.status(500).json({ erro: "Não foi possível verificar a sessão" })
        }

        if (!usuario) {
            return encerrarSessao(req, res, (erroSessao) => {
                if (erroSessao) {
                    console.log("Erro ao encerrar sessão:", erroSessao)

                    return res.status(500).json({ erro: "Não foi possível encerrar a sessão" })
                }

                return res.json({ logado: false })
            })
        }

        // atualiza a sessão com os dados atuais do banco
        req.session.usuario = {
            id: usuario.user_id,
            nome: usuario.user_name,
            tipo: usuario.user_tipo,
            avatar: usuario.user_avatar
        }

        return res.status(200).json({
            logado: true,
            usuario: req.session.usuario
        })
    })
}

// busca os dados do perfil usando o id da sessão
function buscarPerfil(req, res) {
    res.set("Cache-control", "no-store") // impede o reaproveitamento da resposta pelo navegador

    if (!req.session.usuario) {

        return res.status(401).json({ erro: "Faça login para acessar seu perfil" })
    }

    // identifica a conta pela sessão sem aceitar um id enviado pelo navegador
    const id = req.session.usuario.id

    userModel.buscarPorId(id, (erro, usuario) => {
        if (erro) {
            console.log("Erro ao consultar perfil:", erro.code)

            return res.status(500).json({ erro: "Não foi possível carregar seu perfil." })
        }

        if (!usuario) {
            return encerrarSessao(req, res, (erroSessao) => {
                if (erroSessao) {
                    console.log("Erro ao encerrar sessão:", erroSessao.message)

                    return res.status(500).json({ erro: "Não foi possível encerrar a sessão" })
                }

                return res.status(401).json({ erro: "Sua conta não está mais disponível" })
            })
        }

        return res.json({
            nome: usuario.user_name,
            email: usuario.user_email,
            avatar: usuario.user_avatar || ":D"
        })
    })
}

// valida os dados e confere a senha atual antes de atualizar o perfil
function atualizarPerfil(req, res) {
    res.set("Cache-Control", "no-store") // impede o reaproveitamento da resposta pelo navegador

    if (!req.session.usuario) {

        return res.status(401).json({ erro: "Faça login para alterar seu perfil" })
    }

    if (!req.is("application/json")) {

        return res.status(415).json({ erro: "Envie os dados no formato JSON" })
    }

    // identifica a conta pela sessão sem aceitar um id enviado pelo navegador
    const id = req.session.usuario.id

    // usa um objeto vazio se req.body retornar qualquer valor "falsy"
    const dados = req.body || {}

    const usuario = normalizarUsuario({
        nome: dados.nome,
        email: dados.email,
        avatar: dados.avatar
    })

    const erroValidacao = usuarioValidacao.validarDadosUsuario(usuario)

    if (erroValidacao) {

        return res.status(400).json({ erro: erroValidacao })
    }

    const senhaAtual = dados.senhaAtual

    // limita a senha a 72 bytes para evitar que o bcrypt ignore parte dela
    if (typeof senhaAtual !== "string" || senhaAtual.length === 0 || Buffer.byteLength(senhaAtual, "utf8") > 72) {
        return res.status(400).json({ erro: "Informe uma senha atual válida" })
    }

    userModel.buscarSenhaPorId(id, async (erroBusca, conta) => {
        if (erroBusca) {
            console.log("Erro ao consultar senha:", erroBusca.code)

            return res.status(500).json({ erro: "Não foi possível verificar sua conta." })
        }

        if (!conta) {
            return res.status(401).json({ erro: "Sua conta não está mais disponível" })
        }

        let senhaCorreta

        try {
            senhaCorreta = await compararHash(senhaAtual, conta.user_pass)

        } catch (erroSenha) {
            console.log("Erro ao verificar senha:", erroSenha.message)

            return res.status(500).json({ erro: "Não foi possível verificar sua senha" })
        }

        if (!senhaCorreta) {
            return res.status(403).json({ erro: "A senha atual está incorreta." })
        }

        // verifica se o nome ou o email já pertence a outra conta
        userModel.buscarUsuarioDuplicado(usuario, id, (erroDuplicado, usuarios) => {
            if (erroDuplicado) {
                console.log("Erro ao verificar usuario duplicado:", erroDuplicado.code)

                return res.status(500).json({ erro: "Não foi possível verificar os dados do perfil" })
            }

            if (usuarios.length > 0) {
                return res.status(409).json({ erro: "O nome de usuário ou e-mail ja está cadastrado" })
            }

            userModel.atualizarPerfil(id, usuario, (erro, resultado) => {
                if (erro) {
                    // trata também a duplicidade identificada pelo banco durante a gravação
                    if (erro.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({ erro: "O nome de usuário ou e-mail ja está cadastrado" })
                    }

                    console.log("Erro ao atualizar perfil:", erro.code)

                    return res.status(500).json({ erro: "Não foi possível atualizar seu perfil." })
                }

                if (resultado.affectedRows === 0) {
                    return res.status(404).json({ erro: "A conta não foi encontrada." })
                }

                // atualiza nome e avatar na sessão após salvar o perfil
                req.session.usuario.nome = usuario.nome
                req.session.usuario.avatar = usuario.avatar

                const log = {
                    userId: id,
                    acao: "Perfil atualizado pelo próprio usuário"
                }

                logModel.registrarLog(log, (erroLog) => {
                    if (erroLog) {
                        console.log("Erro ao registrar edição do perfil:", erroLog.code)
                    }

                    return res.json({ mensagem: "Perfil atualizado com sucesso." })
                })
            })
        })
    })
}

// confere a senha atual antes de excluir a conta do usuário conectado
function excluirPerfil(req, res) {
    res.set("Cache-Control", "no-store") // impede o reaproveitamento da resposta pelo navegador

    if (!req.session.usuario) {
        return res.status(401).json({ erro: "Faça login para excluir sua conta" })
    }

    if (!req.is("application/json")) {
        return res.status(415).json({ erro: "Envie os dados no formato JSON." })
    }

    // identifica a conta pela sessão sem aceitar um id enviado pelo navegador
    const id = req.session.usuario.id

    // usa um objeto vazio se req.body retornar qualquer valor "falsy"
    const dados = req.body || {}

    const senhaAtual = dados.senhaAtual

    // limita a senha a 72 bytes para evitar que o bcrypt ignore parte dela
    if (typeof senhaAtual !== "string" || senhaAtual.length === 0 || Buffer.byteLength(senhaAtual, "utf8") > 72) {
        return res.status(400).json({ erro: "Informe uma senha atual válida." })
    }

    userModel.buscarSenhaPorId(id, async (erroBusca, conta) => {
        if (erroBusca) {
            console.log("Erro ao consultar conta:", erroBusca.code)

            return res.status(500).json({ erro: "Não foi possível verificar sua conta" })
        }

        if (!conta) {
            return res.status(401).json({ erro: "Sua conta não está mais disponível." })
        }

        let senhaCorreta

        try {
            senhaCorreta = await compararHash(senhaAtual, conta.user_pass)

        } catch (erroSenha) {
            console.log("Erro ao verificar senha:", erroSenha.message)

            return res.status(500).json({ erro: "Não foi possível verificar sua senha." })
        }

        if (!senhaCorreta) {
            return res.status(403).json({ erro: "A senha atual está incorreta." })
        }

        userModel.excluirUsuario(id, (erro, resultado) => {
            if (erro) {
                console.log("Erro ao excluir perfil:", erro.code)

                return res.status(500).json({ erro: "Não foi possível excluir sua conta." })
            }

            if (resultado.affectedRows === 0) {

                return res.status(404).json({ erro: "A conta não foi encontrada." })
            }

            // registra sem vínculo com o usuário porque a conta já foi excluída
            const log = {
                userId: null,
                acao: `Conta excluída pelo próprio usuário. ID: ${id}`
            }

            logModel.registrarLog(log, (erroLog) => {
                if (erroLog) {
                    console.log("Erro ao registrar exclusão:", erroLog.code)
                }

                encerrarSessao(req, res, (erroSessao) => {
                    if (erroSessao) {
                        console.log("Erro ao encerrar sessão após exclusão:", erroSessao.message)
                    }

                    return res.json({ mensagem: "Sua conta foi excluida." })
                })
            })
        })
    })
}

module.exports = {
    criarUsuario,
    loginUsuario,
    logoutUsuario,
    verificarSessao,
    buscarPerfil,
    atualizarPerfil,
    excluirPerfil
}
