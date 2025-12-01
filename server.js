// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trim das variáveis de ambiente
const SMTP_USER = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : "";
const SMTP_PASS = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : "";
const SMTP_HOST = process.env.SMTP_HOST ? process.env.SMTP_HOST.trim() : "";
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT.trim()) : 587;
const EMAIL_DESTINO = process.env.EMAIL_DESTINO ? process.env.EMAIL_DESTINO.trim() : "";

console.log("🚀 Variáveis de ambiente carregadas:");
console.log("SMTP_USER:", SMTP_USER);
console.log("SMTP_PASS:", SMTP_PASS ? "********" : "(vazio)");
console.log("SMTP_HOST:", SMTP_HOST);
console.log("SMTP_PORT:", SMTP_PORT);
console.log("EMAIL_DESTINO:", EMAIL_DESTINO);

// Transporter Nodemailer
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  logger: true,
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
    from: `"${Nome}" <${SMTP_USER}>`,
    to: EMAIL_DESTINO,
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
    console.log("✅ Email enviado com sucesso!");
    res.send("Formulário enviado com sucesso! ✅");
  } catch (error) {
    console.error("❌ Erro completo ao enviar e-mail:");
    console.error(error);
    // Envia o erro completo para o front-end (temporário, só para debug)
    res.status(500).send(`Erro ao enviar e-mail: ${error.message}`);
  }
});

// Porta do servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
