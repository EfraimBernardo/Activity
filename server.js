require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const path = require("path");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota de envio do formulário
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

  if (!Nome || !Idade || !Email || !Telefone || !Pretende || !Instituicao || !Saber) {
    return res.status(400).send("Preencha todos os campos obrigatórios!");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"Formulário Actividade" <formulario@${process.env.DOMINIO}>`,
      to: "efraimjoaomanuelbernardo@gmail.com",
      subject: "Nova Inscrição na Actividade",
      html: `
        <h2>Nova Inscrição Recebida</h2>
        <p><b>Nome:</b> ${Nome}</p>
        <p><b>Idade:</b> ${Idade}</p>
        <p><b>Email:</b> ${Email}</p>
        <p><b>Telefone:</b> ${Telefone}</p>
        <p><b>Visão sobre a actividade:</b> ${Pretende}</p>
        <p><b>Resultados esperados:</b> ${Instituicao}</p>
        <p><b>Como soube da actividade:</b> ${Saber}</p>
        <p><b>Comentários:</b> ${Comentarios || "Nenhum"}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.send("✅ Inscrição enviada com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).send("❌ Erro ao enviar. Tente novamente.");
  }
});

// Servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Servidor rodando em http://localhost:" + PORT);
});
