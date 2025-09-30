import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

// Configurar listeners para logs do Prisma
prisma.$on("query", (e) => {
  logger.debug("Query do banco de dados executada", {
    query: e.query,
    params: e.params,
    duration: e.duration,
    target: e.target,
  });
});

prisma.$on("error", (e) => {
  logger.error("Erro do Prisma:", {
    message: e.message,
    target: e.target,
  });
});

prisma.$on("info", (e) => {
  logger.info("Info do Prisma:", {
    message: e.message,
    target: e.target,
  });
});

prisma.$on("warn", (e) => {
  logger.warn("Aviso do Prisma:", {
    message: e.message,
    target: e.target,
  });
});

export async function connectDB() {
  try {
    await prisma.$connect();
    logger.info("✅ Banco de dados conectado com sucesso!");
  } catch (error) {
    logger.error("❌ Falha na conexão com o banco de dados:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

process.on("beforeExit", async () => {
  logger.info("Desconectando do banco de dados...");
  await prisma.$disconnect();
  logger.info("Banco de dados desconectado");
});
