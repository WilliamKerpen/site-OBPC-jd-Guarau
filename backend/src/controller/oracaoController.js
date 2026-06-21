import { enviarEmail } from "../utils/mailer.js";

export async function enviarPedido(req, res) {
  try {
    let { nome, email, pedido, lgpd, website, inicio } = req.body;

    // 1. Honeypot
    if (website && website.trim() !== "") {
      return res.status(400).json({ erro: "Bot detectado." });
    }

    // 2. Delay anti-bot
    const tempoMinimo = 3000;
    if (!inicio || Date.now() - Number(inicio) < tempoMinimo) {
      return res.status(400).json({ erro: "Envio muito rápido. Possível bot." });
    }

    // 3. User-Agent
    const ua = req.headers["user-agent"] || "";
    if (ua.length < 10) {
      return res.status(400).json({ erro: "User-Agent inválido." });
    }

    // 4. Sanitização
    const sanitize = (str = "") => {
      return str
        .replace(/<[^>]*>?/gm, "")
        .replace(/script/gi, "")
        .replace(/on\w+=/gi, "")
        .trim();
    };

    nome = sanitize(nome);
    email = sanitize(email);
    pedido = sanitize(pedido);

    // 5. Bloquear links
    if (/https?:\/\//i.test(pedido)) {
      return res.status(400).json({ erro: "Links não são permitidos." });
    }

    // 6. Bloquear palavras perigosas
    const proibidos = ["DROP TABLE", "SELECT *", "INSERT INTO", "DELETE FROM", "<SCRIPT"];
    for (const palavra of proibidos) {
      if (pedido.toUpperCase().includes(palavra)) {
        return res.status(400).json({ erro: "Conteúdo inválido detectado." });
      }
    }

    // 7. Validação básica
    if (!nome || nome.length < 3) {
      return res.status(400).json({ erro: "Nome inválido." });
    }

    if (!pedido || pedido.length < 10) {
      return res.status(400).json({ erro: "Pedido muito curto." });
    }

    if (!lgpd) {
      return res.status(400).json({ erro: "É necessário aceitar a LGPD." });
    }

    // 8. Enviar e-mail
    await enviarEmail({ nome, email, pedido });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Pedido enviado com sucesso."
    });

  } catch (error) {
    console.error("Erro ao enviar pedido:", error);
    return res.status(500).json({ erro: "Erro ao enviar pedido." });
  }
}
