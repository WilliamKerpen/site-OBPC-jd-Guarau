import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import oracaoRoute from "./routes/oracao.js";
import { limiter } from "./utils/rateLimit.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "https://www.igrejaobpcguarau.org",
    "https://igrejaobpcguarau.org"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.use(express.json());
app.set("trust proxy", 1);
app.use("/api/pedido-oracao", limiter, oracaoRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Backend rodando na porta " + PORT));
