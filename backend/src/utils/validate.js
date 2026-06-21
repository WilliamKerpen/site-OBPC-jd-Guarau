export function validarPedido(body) {
  const erros = [];

  if (!body.nome || body.nome.trim().length < 3)
    erros.push("Nome inválido.");

  if (body.email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(body.email)) erros.push("E-mail inválido.");
  }

  if (!body.pedido || body.pedido.trim().length < 10)
    erros.push("Pedido muito curto.");

  if (!body.lgpd)
    erros.push("É necessário aceitar a LGPD.");

  if (body.website) // honeypot
    erros.push("Bot detectado.");

  return erros;
}