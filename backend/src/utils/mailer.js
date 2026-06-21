import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // Hostinger usa SSL na 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function enviarEmail({ nome, email, pedido }) {
  try {
    await transporter.verify();
    console.log("SMTP conectado. Pronto para enviar mensagens.");

    return transporter.sendMail({
      from: `"Site OBPC Guaraú" <${process.env.SMTP_USER}>`,
      to: process.env.DESTINO_PASTOR,
      subject: `Novo pedido de oração - ${nome}`,
      html: `
        <h2>Novo pedido de oração</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email || "Não informado"}</p>
        <p><strong>Pedido:</strong><br>${pedido}</p>
      `
    });
  } catch (err) {
    console.error("Falha na conexacao com o servico de E-Mail:", err);
    throw err;
  }
}
