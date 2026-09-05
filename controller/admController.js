const bcrypt = require("bcrypt")
const userModel = require("../model/userModel")

async function loginAdm(req, res) {

        const email = req.body.email;
        const senha = req.body.senha;

        const user = await userModel.buscarPorEmail(email, async (erro, user) => {
            // erro no banco
            if (erro) {
                console.log(erro);

                return res.status(500).json({
                    erro: "Erro ao buscar usuário"
                });
            }

            // se usuario não existir
            if (!user) {
                return res.status(401).json({
                    erro: "Email ou senha incorretos1"
                })
            }

            try {
                const senhaCorreta = await bcrypt.compare(senha, user.user_pass)
                
                
                if (!senhaCorreta) {
                    // se a senha não coincidir
                    return res.status(401).json({
                        erro: "Email ou senha incorretos2"
                    })
                }
            
                if (user.user_tipo !== 'admin') {
                    // se não for admin
                    return res.status(403).json({
                        erro: "Você não é um administrador"
                    })
                }

                // se passar por todas as verificações
                return res.status(200).json({
                    mensagem: "Login feito com sucesso"
                })
            } catch (erro) {
                console.log(erro)
                
                return res.status(500).json({
                    erro: "Erro ao verificar senha"
                });
            }
        })
    } 
    

module.exports = {
    loginAdm
}