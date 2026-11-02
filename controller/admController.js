const path = require('path')

const autenticacaoService = require("../service/autenticacaoService")

const userModel = require("../model/userModel")
const comentarioModel = require("../model/comentarioModel")
const logModel = require("../model/logModel")
const usuarioValidacao = require("../validacoes/usuarioValidacao")

const { lerConsulta, montarPagina } = require("../utils/paginacao")
const { iniciarSessao } = require("../utils/sessao")
const { normalizarUsuario } = require("../utils/normalizarUsuario")

//----------------------------------------------------------------------------------------------
// funções gerais

// autentica a conta como admin e inicia a sessão antes de abrir o painel
function loginAdm(req, res, next) {
    const dados = req.body || {}

    autenticacaoService.autenticar(
        dados.email,
        dados.senha,
        true,
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
                    acao: "Login realizado no acesso do admin"
                }

                logModel.registrarLog(log, (erroLog) => {
                    if (erroLog) {
                        console.log("Erro ao registrar o login do admin:", erroLog.code)
                    }

                    return res.redirect("/adm/painel")
                })
            })
        }
    )
} 

// responde a rota protegida com o arquivo da página do admin
function enviarPainel(req, res) {
    res.sendFile(path.join(__dirname, "../private/admin/admin.html"))
}

// responde a rota protegida com o script do painel do admin
function enviarAdminJs(req, res) {
    res.sendFile(path.join(__dirname, "../private/admin/admin.js"))
}

//---------------------------------------------------------------------------------------------------
// funções de usuários

// consulta os usuários com pesquisa e paginação
function buscarUsuarios(req, res, next) {
    const consulta = lerConsulta(req.query)

    if (!consulta) {
        return res.status(400).json({ erro: "Página ou pesquisa inválida." })
    }

    const { pesquisa, limite, deslocamento } = consulta

    // consulta um registro extra para descobrir se existe uma próxima página
    userModel.buscarTodosUsuarios(pesquisa, limite + 1, deslocamento, (erro, usuarios) => {
        if (erro) {
            return next(erro)
        }

        return res.json(
            montarPagina("usuarios", usuarios, consulta)
        )
    })
}

// valida o id e busca os dados da conta para abrir a edição
function buscarUsuarioPorId(req, res, next) {
    const idRecebido = req.params.id

    // aceita apenas dígitos no id recebido pela rota
    if (!/^\d+$/.test(idRecebido)) {
        return res.status(400).json({ erro: "ID de usuário inválido." })
    }

    const id = Number(idRecebido)

    // exige um id inteiro positivo dentro da faixa segura do javascript
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID de usuário inválido." })
    }

    userModel.buscarPorId(id, (erro, usuario) => {
        if (erro) {
            return next(erro)
        }

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado." })
        }

        return res.status(200).json(usuario)
    })
}

// exclui a conta escolhida e registra a ação do admin
function excluirUsuario(req, res, next) {
    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "Identificador do usuário inválido" })
    }

    // impede que o admin exclua a própria conta pelo painel
    if (id === Number(req.session.usuario.id)) {
        return res.status(400).json({ erro: "Você não pode excluir sua própria conta" })
    }

    userModel.excluirUsuario(id, (erro, resultado) => {
        if (erro) {
            return next(erro)
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." })
        }

        const log = {
            userId: req.session.usuario.id,
            acao: `Usuário excluido pelo admin. ID: ${id}`
        }

        return logModel.registrarLog(log, (erroLog) => {
            if (erroLog) {
                console.log("Erro ao registrar a exclusão do usuário:", erroLog.code)
            }

            return res.json({ mensagem: "Usuário excluido com sucesso"})
        })
    })
}

// prepara e valida os dados antes de atualizar a conta escolhida
function atualizarUsuario(req, res) {
    const id = Number(req.params.id)

    // usa um objeto vazio se req.body retornar qualquer valor "falsy"
    const dados = req.body || {}

    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({ erro: "ID de usuário inválido" })
    }

    const usuario = normalizarUsuario({
        nome: dados.nome,
        email: dados.email,
        tipo: dados.tipo,
        avatar: dados.avatar
    })

    const erroValidacao = usuarioValidacao.validarDadosUsuario(usuario)

    if (erroValidacao) {
        return res.status(400).json({ erro: erroValidacao })
    }

    if (usuario.tipo !== "usuario" && usuario.tipo !== "admin") {
        return res.status(400).json({ erro: "Tipo de usuário inválido" })
    }

    userModel.buscarUsuarioDuplicado(usuario, id, (erroBusca, usuarios) => {
        if (erroBusca) {
            console.log("Erro ao verificar duplicidade:", erroBusca.code)

            return res.status(500).json({ erro: "Não foi possível verificar os dados do usuário" })
        }

        if (usuarios.length > 0) {
            return res.status(409).json({ erro: "O nome de usuário ou e-mail já pertence a outra conta." })
        }

        userModel.atualizarUsuario(id, usuario, (erro, resultado) => {
            if (erro) {
                // trata a duplicidade que pode surgir entre a consulta e a gravação
                if (erro.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ erro: "O nome de usuário ou e-mail ja pertence a outra conta." })
                }

                console.log("Erro ao atualizar usuário:", erro.code)
            
                return res.status(500).json({ erro: "Erro ao atualizar usuário" })
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ erro: "Usuário não encontrado." })
            }

            const log = {
                userId: req.session.usuario.id,
                acao: `Cadastro atualizado pelo admin. User ID: ${id}`
            }

            return logModel.registrarLog(log, (erroLog) => {
                if (erroLog) {
                    console.log("Erro ao registrar a atualização:", erroLog.code)
                }

                return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" })
            })
        })
    })
}

// funções de comentários

// consulta os comentários com pesquisa e paginação
function buscarComentarios(req, res, next) {
    const consulta = lerConsulta(req.query)

    if (!consulta) {
        return res.status(400).json({ erro: "Página ou pesquisa inválida." })
    }

    const { pesquisa, limite, deslocamento } = consulta

    // consulta um registro extra para descobrir se existe uma próxima página
    comentarioModel.buscarTodosComentarios(pesquisa, limite + 1, deslocamento, (erro, comentarios) => {
        if (erro) {
            return next(erro)
        }

        return res.json(
            montarPagina("comentarios", comentarios, consulta)
        )
    })
}

// exclui o comentário escolhido e registra a ação do admin
function excluirComentarioAdmin(req, res) {
    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "Indentificador do comentário inválido." })
    }

    comentarioModel.excluirComentarioAdmin(id, (erro, resultado) => {
        if (erro) {
            console.log("Erro ao excluir comentário:", erro)

            return res.status(500).json({ erro: "Não foi possível excluir o comentário." })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Comentário não encontrado" })
        }

        const log = {
            userId: req.session.usuario.id,
            acao: `Comentário excluído pelo admin. ID: ${id}`
        }

        return logModel.registrarLog(log, (erroLog) => {
            if (erroLog) {
                console.log("Erro ao registrar a exclusão admin:", erroLog)
            }

            return res.json({ mensagem: "Comentário excluido." })
        })
    })
}
//----------------------------------------------------------------------------------------------
// funções de logs

// consulta os logs com pesquisa e paginação
function buscarLogs(req, res, next) {
    const consulta = lerConsulta(req.query)

    if (!consulta) {
        return res.status(400).json({ erro: "Página ou pesquisa inválida." })
    }

    const { pesquisa, limite, deslocamento } = consulta

    logModel.buscarTodosLogs(pesquisa, limite + 1, deslocamento, (erro, logs) => {
            if (erro) {
                return next(erro)
            }

            return res.json(
                montarPagina("logs", logs, consulta)
            )
        }
    )
}

module.exports = {
    loginAdm,
    enviarPainel,
    enviarAdminJs,
    buscarUsuarios,
    buscarUsuarioPorId,
    excluirUsuario,
    atualizarUsuario,
    buscarComentarios,
    excluirComentarioAdmin,
    buscarLogs
}