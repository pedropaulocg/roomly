import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import routes from "./routes";
import morgan from "morgan";
import { logger } from "./utils/logger";
import { prisma } from "./config/prisma";

export class App {
  public readonly app: Application;
  private readonly port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.middlewares();
    this.routes();
    this.errorHandler();
    this.notFound();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  private routes(): void {
    this.app.use("/", routes);

    this.app.get("/health-check", (_, res) => {
      res.status(200).json({ status: "ok" });
    });
  }

  private notFound() {
    this.app.use((_req, res) => {
      res.status(404).json({ message: "Not Found" });
    });
  }

  private errorHandler(): void {
    this.app.use(
      (err: any, req: Request, res: Response, _next: NextFunction) => {
        logger.error("Erro não tratado:", {
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
      }
    );
  }

  public listen(): void {
    const server = this.app.listen(this.port, () => {
      logger.info(`✅ Servidor rodando em http://localhost:${this.port}`);
    });

    this.setupGracefulShutdown(server);
  }

  private setupGracefulShutdown(server: any): void {
    const shutdown = async () => {
      logger.info("🔻 Encerrando servidor...");

      try {
        // Close the HTTP server first
        server.close(async () => {
          logger.info("Servidor HTTP encerrado");

          // Then disconnect from the database
          logger.info("Desconectando do banco de dados...");
          await prisma.$disconnect();
          logger.info("Banco de dados desconectado");

          logger.info("Servidor encerrado com sucesso");
          process.exit(0);
        });
      } catch (error) {
        logger.error("Erro durante o encerramento:", {
          error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }
}
