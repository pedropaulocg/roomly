"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
require("dotenv/config");
const routes_1 = __importDefault(require("./routes"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./utils/logger");
const prisma_1 = require("./config/prisma");
class App {
    app;
    port;
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.middlewares();
        this.routes();
        this.errorHandler();
        this.notFound();
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, morgan_1.default)("dev"));
    }
    routes() {
        this.app.use("/", routes_1.default);
        this.app.get("/health-check", (_, res) => {
            res.status(200).json({ status: "ok" });
        });
    }
    notFound() {
        this.app.use((_req, res) => {
            res.status(404).json({ message: "Not Found" });
        });
    }
    errorHandler() {
        this.app.use((err, req, res, _next) => {
            logger_1.logger.error("Erro não tratado:", {
                error: err.message,
                stack: err.stack,
                url: req.url,
                method: req.method,
                ip: req.ip,
                userAgent: req.get("User-Agent"),
            });
            res
                .status(err.status || 500)
                .json({ message: err.message || "Internal Server Error" });
        });
    }
    listen() {
        const server = this.app.listen(this.port, () => {
            logger_1.logger.info(`✅ Servidor rodando em http://localhost:${this.port}`);
        });
        this.setupGracefulShutdown(server);
    }
    setupGracefulShutdown(server) {
        const shutdown = async () => {
            logger_1.logger.info("🔻 Encerrando servidor...");
            try {
                // Close the HTTP server first
                server.close(async () => {
                    logger_1.logger.info("Servidor HTTP encerrado");
                    // Then disconnect from the database
                    logger_1.logger.info("Desconectando do banco de dados...");
                    await prisma_1.prisma.$disconnect();
                    logger_1.logger.info("Banco de dados desconectado");
                    logger_1.logger.info("Servidor encerrado com sucesso");
                    process.exit(0);
                });
            }
            catch (error) {
                logger_1.logger.error("Erro durante o encerramento:", {
                    error: error instanceof Error ? error.message : String(error),
                });
                process.exit(1);
            }
        };
        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    }
}
exports.App = App;
