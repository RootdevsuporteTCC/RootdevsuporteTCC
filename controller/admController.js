const bcrypt = require("bcrypt")
const path = require('path')

const userModel = require("../model/userModel")
const comentarioModel = require("../model/comentarioModel")
const logModel = require("../model/logModel")
const usuarioValidacao = require("../validacoes/usuarioValidacao")

//----------------------------------------------------------------------------------------------
// funções gerais

// recebe email e senha, verifica o tipo da conta e redireciona ao painel após criar a sessão
async function loginAdm(req, res) {

        const email = req.body.email;
        const senha = req.body.senha;

        const user = await userModel.buscarPorEmail(email, async (erro, user) => {
            // erro no banco
            if (erro) {
                console.log(erro);

                // status 500 - erro interno do servidor
                return res.status(500).send("Erro ao buscar usuário")
            }

            // se usuario não existir
            if (!user) {
                
                // status 401 - autenticação ausente ou inválida
                return res.status(401).send("Email ou senha incorretos")
            }

            try {
                // função do bcrypt para comparar hashs
                const senhaCorreta = await bcrypt.compare(senha, user.user_pass)
                
                if (!senhaCorreta) {
                    // se a senha não coincidir
                    // status 401 - autenticação ausente ou inválida
                    return res.status(401).send("Email ou senha incorretos")
                }
            
                if (user.user_tipo !== 'admin') {
                    // se não for admin
                    // status 403 - acesso negado
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
                
                // status 500 - erro interno do servidor
                return res.status(500).send("Erro ao verificar senha")
            }
        })
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

// recebe pesquisa e página pela url e devolve usuários e dados da paginação em json
function buscarUsuarios(req, res) {
    const pesquisa = req.query.pesquisa || ''

    let pagina = 1

    if (req.query.pagina !== undefined) {
        pagina = Number(req.query.pagina)
    }

    const limite = 10

    // calcula quantos registros serão pulados antes da página solicitada
    const deslocamento = (pagina - 1) * limite

    // isSafeInteger() verifica se um número pode ser representado com precisão, protege contra valores decimais, NaN e valores grandes demais
    if (!Number.isSafeInteger(pagina) || pagina < 1 || !Number.isSafeInteger(deslocamento) || typeof pesquisa !== "string") {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Página ou pesquisa inválida" })
    }

    // consulta um registro extra para descobrir se existe uma próxima página
    userModel.buscarTodosUsuarios(pesquisa, limite + 1, deslocamento, (erro, usuarios) => {
        if (erro) {
            console.log("Erro ao buscar usuários:", erro);

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível buscar os usuários." });
        }

        const temProxima = usuarios.length > limite

        // remove o registro extra antes de enviar a página ao navegador
        if (temProxima) {
            usuarios.pop()
        }

        // status 200 - requisição bem-sucedida
        return res.status(200).json({
            usuarios: usuarios,
            pagina: pagina,
            temProxima: temProxima
        });
    });
}

// recebe o id pela rota e devolve os dados do usuário encontrado em json
function buscarUsuarioPorId(req, res) {
    const id = req.params.id
    userModel.buscarPorId(id, (erro, usuario) => {
        if (erro) {
            console.log(erro)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Erro ao buscar usuário" })
        }

        if (!usuario) {
            // status 404 - recurso não encontrado
            return res.status(404).json({ erro: "Usuário não encontrado" })
        }

        // status 200 - requisição bem-sucedida
        return res.status(200).json(usuario)
    })
}

// recebe o id pela rota, exclui a conta pelo model, registra a ação e responde em json
function excluirUsuario(req, res) {
    const id = Number(req.params.id)

    // isSafeInteger() verifica se um número pode ser representado com precisão, protege contra valores decimais, NaN e valores grandes demais
    if (!Number.isSafeInteger(id) || id <= 0) {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Identificador do usuário inválido" })
    }

    // impede que o administrador exclua a própria conta pela consulta administrativa
    if (id === Number(req.session.usuario.id)) {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Você não pode excluir sua própria conta" })
    }

    userModel.excluirUsuario(id, (erro, resultado) => {
        if (erro) {
            console.log("Erro ao excluir usuário:", erro)

            if (erro.code === "ER_ROW_IS_REFERENCED_2") {

                // status 409 - conflito nos dados
                return res.status(409).json({ erro: "Esse usuário tem registros vinculados que impedem a exclusão." })
            }

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível excluir o usuário"})
        }

        if (resultado.affectedRows === 0) {

            // status 404 - recurso não encontrado
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

            // status 200 - requisição bem-sucedida
            return res.status(200).json({ mensagem: "Usuário excluido com sucesso"})
        })
    })
}

// recebe id e dados da edição, valida, atualiza pelo model e responde em json
function atualizarUsuario(req, res) {
    const id = Number(req.params.id)

    // usa um objeto vazio se req.body retornar qualquer valor "falsy"
    const dados = req.body || {}

    // isSafeInteger() verifica se um número pode ser representado com precisão, protege contra valores decimais, NaN e valores grandes demais
    if (!Number.isSafeInteger(id) || id < 1) {

        // status 400 - requisição inválida
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

        // status 400 - requisição inválida
        return res.status(400).json({ erro: erroValidacao })
    }

    if (usuario.tipo !== "usuario" && usuario.tipo !== "admin") {

        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Tipo de usuário inválido" })
    }

    userModel.buscarUsuarioDuplicado(usuario, id, (erroBusca, usuarios) => {
        if (erroBusca) {
            console.log("Erro ao verificar duplicidade:", erroBusca.code)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível verificar os dados do usuário" })
        }

        if (usuarios.length > 0) {

            // status 409 - conflito nos dados
            return res.status(409).json({ erro: "O nome de usuário ou e-mail já pertence a outra conta." })
        }

        userModel.atualizarUsuario(id, usuario, (erro, resultado) => {
            if (erro) {
                if (erro.code === "ER_DUP_ENTRY") {

                    // status 409 - conflito nos dados
                    return res.status(409).json({ erro: "O nome de usuário ou e-mail ja pertence a outra conta." })
                }

                console.log("Erro ao atualizar usuário:", erro.code)
            
                // status 500 - erro interno do servidor
                return res.status(500).json({ erro: "Erro ao atualizar usuário" })
            }

            if (resultado.affectedRows === 0) {

                // status 404 - recurso não encontrado
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

                // status 200 - requisição bem-sucedida
                return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" })
            })
        })
    })
}

//funções de comentários

// recebe pesquisa e página pela url e devolve comentários e dados da paginação em json
function buscarComentarios(req, res) {
    const pesquisa = req.query.pesquisa || ""

    let pagina = 1

    if (req.query.pagina !== undefined) {
        pagina = Number(req.query.pagina)
    }

    const limite = 10

    // calcula quantos registros serão pulados antes da página solicitada
    const deslocamento = (pagina -1) * limite

    // isSafeInteger() verifica se um número pode ser representado com precisão, protege contra valores decimais, NaN e valores grandes demais
    if (!Number.isSafeInteger(pagina) || pagina < 1 || !Number.isSafeInteger(deslocamento) || typeof pesquisa !== "string") {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Página ou pesquisa inválida" })
    }

    // consulta um registro extra para descobrir se existe uma próxima página
    comentarioModel.buscarTodosComentarios(pesquisa, limite + 1, deslocamento, (erro, comentarios) => {
        if (erro) {
            console.log("Erro ao buscar comentarios:", erro)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível buscar os comentários" })
        }

        const temProxima = comentarios.length > limite

        // remove o registro extra antes de enviar a página ao navegador
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

// recebe o id pela rota, exclui o comentário, registra a ação e responde em json
function excluirComentarioAdmin(req, res) {
    const id = Number(req.params.id)

    // isSafeInteger() verifica se um número pode ser representado com precisão, protege contra valores decimais, NaN e valores grandes demais
    if (!Number.isSafeInteger(id) || id <= 0) {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Indentificador do comentário inválido." })
    }

    comentarioModel.excluirComentarioAdmin(id, (erro, resultado) => {
        if (erro) {
            console.log("Erro ao excluir comentário:", erro)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível excluir o comentário." })
        }

        if (resultado.affectedRows === 0) {

            // status 404 - recurso não encontrado
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
// função de log

// recebe pesquisa e página pela url e devolve logs e dados da paginação em json
function buscarLogs(req, res) {
    const pesquisa = req.query.pesquisa || ""

    let pagina = 1

    if (req.query.pagina !== undefined) {
        pagina = Number(req.query.pagina)
    }

    const limite = 10
    
    // calcula quantos registros serão pulados antes da página solicitada
    const deslocamento = (pagina - 1) * limite

    // isSafeInteger() verifica se um número pode ser representado com precisão, protege contra valores decimais, NaN e valores grandes demais
    if (!Number.isSafeInteger(pagina) || pagina < 1 || !Number.isSafeInteger(deslocamento) || typeof pesquisa !== "string") {
        
        // status 400 - requisição inválida
        return res.status(400).json({ erro: "Página ou pesquisa inválida" })
    }

    // consulta um registro extra para descobrir se existe uma próxima página
    logModel.buscarTodosLogs(pesquisa, limite + 1, deslocamento, (erro, logs) => {
        if (erro) {
            console.log("Erro ao buscar logs:", erro)

            // status 500 - erro interno do servidor
            return res.status(500).json({ erro: "Não foi possível buscar os logs" })
        }

        const temProxima = logs.length > limite

        // remove o registro extra antes de enviar a página ao navegador
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