const bcrypt = require("bcrypt")
const path = require('path')
const userModel = require("../model/userModel")

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

                return res.redirect('/adm/painel')
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

function buscarUsuarios(req, res) {
    const pesquisa = req.query.pesquisa || ''

    userModel.buscarTodosUsuarios(pesquisa, (erro, usuarios) => {
        if (erro) {
            console.log(erro);

            return res.status(500).send("Erro ao buscar usuários");
        }

        return res.status(200).json(usuarios);
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
    const id = req.params.id
    if (Number(id) === req.session.usuario.id) {
        return res.status(400).json({ erro: "Você não pode excluir sua própria conta" })
    }

    userModel.excluirUsuario(id, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao excluir usuário"})
        }

        return res.status(200).json({ mensagem: "Usuário excluido com sucesso"})
    })
}

function atualizarUsuario(req, res) {
    const id = req.params.id

    const usuario = {
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        tipo: req.body.tipo,
        avatar: req.body.avatar
    }

    userModel.atualizarUsuario(id, usuario, (erro, resultado) => {
        if (erro) {
            console.log(erro)
        
            return res.status(500).json({ erro: "Erro ao atualizar usuário" })
        }

        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" })
    })
}


module.exports = {
    loginAdm,
    enviarPainel,
    enviarAdminJs,
    buscarUsuarios,
    buscarUsuarioPorId,
    excluirUsuario,
    atualizarUsuario
}