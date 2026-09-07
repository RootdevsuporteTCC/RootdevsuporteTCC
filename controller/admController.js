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
                    tipo: user.user_tipo
                }

                return res.redirect('/adm/painel')
            } catch (erro) {
                console.log(erro)
                
                return res.status(500).send("Erro ao verificar senha")
            }
        })
} 

function mostrarPainel(req, res) {

    const htmlPainel = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ROOT DEV - Admin</title>
            <link rel="stylesheet" href="../admin/admin.css">
            <link rel="stylesheet" href="../styles/global.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

            <link rel="icon" href="../img/folder-icon.png" type="image/png">
        </head>
        <body>
            <header>
                <nav>
                    <div class="title">
                        <a href="/">
                            <h1><i class="fa-solid fa-folder"></i>/ROOT_DEV</h1>
                        </a>
                    </div>
                    <div id="auth-buttons">
                        <a href="../login.html">
                            <button>Login</button>
                        </a> 
                        <a href="../cadastro.html">
                            <button>Cadastro</button>
                        </a> 
                    </div>
                    <div id="nav-drawer-container">
                        <div id="nav-drawer">
                            <i class="fa-solid fa-bars" id="menu-icon" onclick="toggleMenu()"></i>
                        </div>
                    </div>
                </nav>
                <div id="nav-drawer-menu" class="menu-fechado">
                    <a href="../login.html">
                        <button>Login</button>
                    </a> 
                    <a href="../cadastro.html">
                        <button>Cadastro</button>
                    </a> 
                </div>
            </header>

            <button onclick="toggleInicio()" id="botao-voltar" class="remove"><i class="fa-solid fa-chevron-left" id="open-arrow"></i></button>

            <main class="admin-container" id="main-container">
                <section class="admin-container" id="adm-inicio">
                    <div class="admin-card">
                        <div class="card-icon">
                            <i class="fa-solid fa-database"></i>
                        </div>
                        <div class="card-title">
                            <h2 class="disket-font">BANCO<br>DE<br>DADOS</h2>
                        </div>
                        <div class="card-desc">
                            <p>Mostra relatórios e consultas no banco.</p>
                        </div>
                        <div class="card-action">
                            <button class="disket-font" onclick="mostrarUsuarios()">ACESSAR</button>
                        </div>
                    </div>

                    <div class="admin-card">
                        <div class="card-icon">
                            <i class="fa-solid fa-comment-dots"></i>
                        </div>
                        <div class="card-title">
                            <h2 class="disket-font">COMENTÁRIOS</h2>
                        </div>
                        <div class="card-desc">
                            <p>Mostrar comentários dos usuários.</p>
                        </div>
                        <div class="card-action">
                            <button class="disket-font">ACESSAR</button>
                        </div>
                    </div>
                </section>

                <section id="tabela-consulta"></section>
            </main>
            <a href="https://wa.me/5511999999999" class="whatsapp" target="_blank">
                <i class="fa-brands fa-whatsapp"></i>
            </a>
        </body>

        <script src="/adm/admin.js"></script>

        <script src="../scripts/nav-drawer.js"></script>

        <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@pigmilcom/a11y/dist/a11y.cdn.js" data-position="bottom-right" data-lang="pt" ></script>

        </html>
    `

    res.send(htmlPainel)
}

function enviarAdminJs(req, res) {
    res.sendFile(path.join(__dirname, "../private/admin/admin.js"))
}

function buscarUsuarios(req, res) {
    userModel.buscarTodosUsuarios((erro, usuarios) => {
        if (erro) {
            console.log(erro);

            return res.status(500).send("Erro ao buscar usuários");
        }

        return res.status(200).json(usuarios);
    });
}

function excluirUsuario(req, res) {
    const id = req.params.id

    userModel.excluirUsuario(id, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao excluir usuário"})
        }

        return res.status(200).json({ mensagem: "Usuário excluido com sucesso"})
    })
}

module.exports = {
    loginAdm,
    mostrarPainel,
    enviarAdminJs,
    buscarUsuarios,
    excluirUsuario
}