"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDB = connectDB;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
exports.prisma = new client_1.PrismaClient({
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
exports.prisma.$on("query", (e) => {
    logger_1.logger.debug("Query do banco de dados executada", {
        query: e.query,
        params: e.params,
        duration: e.duration,
        target: e.target,
    });
});
exports.prisma.$on("error", (e) => {
    logger_1.logger.error("Erro do Prisma:", {
        message: e.message,
        target: e.target,
    });
});
exports.prisma.$on("info", (e) => {
    logger_1.logger.info("Info do Prisma:", {
        message: e.message,
        target: e.target,
    });
});
exports.prisma.$on("warn", (e) => {
    logger_1.logger.warn("Aviso do Prisma:", {
        message: e.message,
        target: e.target,
    });
});
async function connectDB() {
    try {
        await exports.prisma.$connect();
        logger_1.logger.info("✅ Banco de dados conectado com sucesso!");
    }
    catch (error) {
        logger_1.logger.error("❌ Falha na conexão com o banco de dados:", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        process.exit(1);
    }
}
process.on("beforeExit", async () => {
    logger_1.logger.info("Desconectando do banco de dados...");
    await exports.prisma.$disconnect();
    logger_1.logger.info("Banco de dados desconectado");
});
