"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const prisma_1 = require("./config/prisma");
const logger_1 = require("./utils/logger");
const PORT = Number(process.env.PORT) || 3000;
async function bootstrap() {
    try {
        logger_1.logger.info("Iniciando aplicação...");
        await (0, prisma_1.connectDB)();
        const server = new app_1.App(PORT);
        server.listen();
    }
    catch (error) {
        logger_1.logger.error("Erro ao inicializar aplicação:", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        process.exit(1);
    }
}
bootstrap();
