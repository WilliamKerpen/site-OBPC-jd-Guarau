/**
 * Spam protect
 */

import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 2, // máximo de 3 envios por IP
  message: { erro: "Você atingiu o limite de 2 envios. Tente novamente em alguns minutos." }
});
