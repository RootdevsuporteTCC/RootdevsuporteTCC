const nodemailer = require("nodemailer")

// configura o envio pelo gmail usando as credenciais
const email = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

module.exports = email