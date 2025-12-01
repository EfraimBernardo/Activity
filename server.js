// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Nodemailer para MailerSend
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,        // não usar SSL direto
  requireTLS: true,     // força TLS
  auth: {
    user: process.env.SMTP_USER && process.env.SMTP_USER.trim(),
    pass: process.env.SMTP_PASS && process.env.SMTP_PASS.trim(),
  },
  logger: true,  // logs detalhados no Render
  debug: true
});

// Rota para envio de formulário
app.post("/enviar", async (req, res) => {
  const {
    Nome,
    Idade,
    Email,
    Telefone,
    Pretende,
    Instituicao,
    Saber,
    Comentarios
  } = req.body;

  const mailOptions = {
    from: `"${Nome}" <${process.env.SMTP_USER && process.env.SMTP_USER.trim()}>`,
    to: process.env.EMAIL_DESTINO,  // seu Gmail
    subject: `Novo cadastro da actividade: ${Nome}`,
    text: `
Nome: ${Nome}
Idade: ${Idade}
Email: ${Email}
Telefone: ${Telefone}
Visão: ${Pretende}
Resultados esperados: ${Instituicao}
Como soube: ${Saber}
Comentários: ${Comentarios || "Nenhum"}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado para ${process.env.EMAIL_DESTINO}`);
    res.send("Formulário enviado com sucesso! ✅");
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
    res.status(500).send("Erro ao enviar o formulário. Tente novamente ❌");
  }
});

// Porta do servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
