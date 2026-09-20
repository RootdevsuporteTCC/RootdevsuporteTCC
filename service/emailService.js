const email = require("../config/email")

// recebe destinatário e código e monta o email de recuperação
// entrega o erro ou resultado do envio pelo callback
function enviarCodigoRecuperacao(destinatario, codigo, callback) {
    const mensagem = {
        from: {
            name: "ROOT DEV",
            address: process.env.SMTP_USER
        },
        to: destinatario,
        subject: "ROOT DEV - Recuperação de senha",
        text: `Você solicitou a recuperação de senha da sua conta no ROOT DEV.
        
        Seu código de recuperação é: ${codigo}

        O código expira em 10 minutos após a solicitação e só pode ser utilizado uma vez.

        Não compartilhe esse código.

        Se você não solicitou a recuperação, ignore este e-mail.`
    }

    // manda a mensagem pro email configurado
    email.sendMail(mensagem, callback)
}

module.exports = {
    enviarCodigoRecuperacao
}