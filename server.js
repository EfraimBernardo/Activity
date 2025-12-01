require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuração do Nodemailer com MailerSend
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // true para 465, false para 587
  auth: {
     user: process.env.SMTP_USER?.trim(),
     pass: process.env.SMTP_PASS?.trim()
  }
});

app.post('/enviar', async (req, res) => {
  const { Nome, Idade, Email, Telefone, Pretende, Instituicao, Saber, Comentarios } = req.body;

  if (!Nome || !Idade || !Email || !Telefone || !Pretende || !Instituicao || !Saber) {
    return res.status(400).send('Preencha todos os campos obrigatórios!');
  }

  const mensagem = `
    Nome: ${Nome}
    Idade: ${Idade}
    Email: ${Email}
    Telefone: ${Telefone}
    VISÃO SOBRE A ACTIVIDADE: ${Pretende}
    RESULTADOS ESPERADOS: ${Instituicao}
    COMO SOUBE DA ACTIVIDADE: ${Saber}
    Comentários: ${Comentarios || 'N/A'}
  `;

  try {
    await transporter.sendMail({
      from: `"Activity Form" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_DESTINO,
      subject: 'Novo cadastro na actividade',
      text: mensagem
    });

   res.send("Email enviado com sucesso!");
  } catch (error) {
    console.error('Erro no envio:', error);
    res.status(500).send('❌ Erro ao enviar email. Tente novamente.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
