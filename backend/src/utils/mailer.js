// mailer.js
// ===============================================
// Envio de e-mails usando o serviço Resend
// Substitui completamente o Nodemailer + SMTP
// ===============================================

import { Resend } from "resend";

// Instancia o cliente Resend usando a chave da API
// (Render injeta automaticamente process.env.RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * enviarEmail
 * -----------------------------------------------
 * Função responsável por enviar o pedido de oração
 * Mantém o mesmo nome da função antiga para evitar
 * quebrar outras partes do seu backend.
 *
 * @param {Object} dados - { nome, email, pedido }
 */
export async function enviarEmail({ nome, email, pedido }) {
  try {
    // Envia o e-mail usando a API do Resend
    const response = await resend.emails.send({
      from: process.env.EMAIL_REMETENTE, // remetente configurado no Render
      to: process.env.EMAIL_DESTINO,     // destinatário (pastor)
      subject: `Novo pedido de oração - ${nome}`,
      html: `
        <h2>Novo Pedido de Oração</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email || "Não informado"}</p>
        <p><strong>Pedido:</strong></p>
        <p>${pedido}</p>
      `
    });

    console.log("Email enviado com sucesso:", response);
    return response;

  } catch (erro) {
    console.error("Erro ao enviar e-mail via Resend:", erro);
    throw erro; // deixa o controller lidar com o erro
  }
}
