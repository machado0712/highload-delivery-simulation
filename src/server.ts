import mongoose from "mongoose";

import app from "./app";

const PORT = process.env.PORT ?? '3000';
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/delivery";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB conectado");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err: unknown) => { console.error("❌ Erro ao conectar no MongoDB", err); });
