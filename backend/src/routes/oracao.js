import express from "express";
import { enviarPedido } from "../controller/oracaoController.js";

const router = express.Router();

router.post("/", enviarPedido);

export default router;
