const bcrypt = require("bcrypt")
const path = require('path')

const userModel = require("../model/userModel")
const comentarioModel = require("../model/comentarioModel")
const logModel = require("../model/logModel")
const usuarioValidacao = require("../validacoes/usuarioValidacao")

//funções gerais
async function loginAdm(req, res) {

        const email = req.body.email;
        const senha = req.body.senha;

        const user = await userModel.buscarPorEmail(email, async (erro, user) => {
            // erro no banco
            if (erro) {
                console.log(erro);

                return res.status(500).send("Erro ao buscar usuário")
            }

            // se usuario não existir
            if (!user) {
                return res.status(401).send("Email ou senha incorretos")
            }

            try {
                const senhaCorreta = await bcrypt.compare(senha, user.user_pass)
                
                if (!senhaCorreta) {
                    // se a senha não coincidir
                    return res.status(401).send("Email ou senha incorretos")
                }
            
                if (user.user_tipo !== 'admin') {
                    // se não for admin
                    return res.status(403).send("Você não é um administrador")
                }

                // se passar por todas as verificações

                req.session.usuario = {
                    id: user.user_id,
                    nome: user.user_name,
                    tipo: user.user_tipo,
                    avatar: user.user_avatar
                }

                const log = {
                    userId: req.session.usuario.id,
                    acao: "Login realizado no acesso do admin"
                }

                return logModel.registrarLog(log, (erroLog) => {
                    if (erroLog) {
                        console.log("Erro ao registrar o login do admin:", erroLog)
                    }

                    return res.redirect('/adm/painel')
                })
            } catch (erro) {
                console.log(erro)
                
                return res.status(500).send("Erro ao verificar senha")
            }
        })
} 

function enviarPainel(req, res) {
    res.sendFile(path.join(__dirname, "../private/admin/admin.html"))
}

function enviarAdminJs(req, res) {
    res.sendFile(path.join(__dirname, "../private/admin/admin.js"))
}

//funções de usuários
function buscarUsuarios(req, res) {
    const pesquisa = req.query.pesquisa || ''

    let pagina = 1

    if (req.query.pagina !== undefined) {
        pagina = Number(req.query.pagina)
    }

    const limite = 50
    const deslocamento = (pagina - 1) * limite

    if (!Number.isSafeInteger(pagina) || pagina < 1 || !Number.isSafeInteger(deslocamento) || typeof pesquisa !== "string") {
        return res.status(400).json({ erro: "Página ou pesquisa inválida" })
    }

    userModel.buscarTodosUsuarios(pesquisa, limite + 1, deslocamento, (erro, usuarios) => {
        if (erro) {
            console.log("Erro ao buscar usuários:", erro);

            return res.status(500).json({ erro: "Não foi possível buscar os usuários." });
        }

        const temProxima = usuarios.length > limite

        if (temProxima) {
            usuarios.pop()
        }

        return res.status(200).json({
            usuarios: usuarios,
            pagina: pagina,
            temProxima: temProxima
        });
    });
}

function buscarUsuarioPorId(req, res) {
    const id = req.params.id
    userModel.buscarPorId(id, (erro, usuario) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao buscar usuário" })
        }

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" })
        }

        return res.status(200).json(usuario)
    })
}

function excluirUsuario(req, res) {
    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "Identificador do usuário inválido" })
    }

    if (id === Number(req.session.usuario.id)) {
        return res.status(400).json({ erro: "Você não pode excluir sua própria conta" })
    }

    userModel.excluirUsuario(id, (erro, resultado) => {
        if (erro) {
            console.log("Erro ao excluir usuário:", erro)

            if (erro.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({ erro: "Esse usuário tem registros vinculados que impedem a exclusão." })
            }

            return res.status(500).json({ erro: "Não foi possível excluir o usuário"})
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
                console.log("Erroo ao registrar a exclusão do usuário:", erroLog)
            }

            return res.status(200).json({ mensagem: "Usuário excluido com sucesso"})
        })
    })
}

function atualizarUsuario(req, res) {
    const id = Number(req.params.id)
    const dados = req.body || {}

    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({ erro: "ID de usuário inválido" })
    }

    const usuario = {
        nome: dados.nome,
        email: dados.email,
        tipo: dados.tipo,
        avatar: dados.avatar
    }

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

//funções de comentários
function buscarComentarios(req, res) {
    const pesquisa = req.query.pesquisa || ""

    let pagina = 1

    if (req.query.pagina !== undefined) {
        pagina = Number(req.query.pagina)
    }

    const limite = 50
    const deslocamento = (pagina -1) * limite

    if (!Number.isSafeInteger(pagina) || pagina < 1 || !Number.isSafeInteger(deslocamento) || typeof pesquisa !== "string") {
        return res.status(400).json({ erro: "Página ou pesquisa inválida" })
    }

    comentarioModel.buscarTodosComentarios(pesquisa, limite + 1, deslocamento, (erro, comentarios) => {
        if (erro) {
            console.log("Erro ao buscar comentarios:", erro)

            return res.status(500).json({ erro: "Não foi possível buscar os comentários" })
        }

        const temProxima = comentarios.length > limite

        if (temProxima) {
            comentarios.pop()
        }

        return res.json({
            comentarios: comentarios,
            pagina: pagina,
            temProxima: temProxima
        })
    })
}

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

//funções de log
function buscarLogs(req, res) {
    const pesquisa = req.query.pesquisa || ""

    let pagina = 1

    if (req.query.pagina !== undefined) {
        pagina = Number(req.query.pagina)
    }

    const limite = 50
    const deslocamento = (pagina - 1) * limite

    if (!Number.isSafeInteger(pagina) || pagina < 1 || !Number.isSafeInteger(deslocamento) || typeof pesquisa !== "string") {
        return res.status(400).json({ erro: "Página ou pesquisa inválida" })
    }

    logModel.buscarTodosLogs(pesquisa, limite + 1, deslocamento, (erro, logs) => {
        if (erro) {
            console.log("Erro ao buscar logs:", erro)

            return res.status(500).json({ erro: "Não foi possível buscar os logs" })
        }

        const temProxima = logs.length > limite

        if (temProxima) {
            logs.pop()
        }

        return res.json({
            logs: logs,
            pagina: pagina,
            temProxima: temProxima
        })
    })
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