import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import routes from "./routes";
import morgan from "morgan";
import { logger } from "./utils/logger";

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
    const shutdown = () => {
      logger.info("🔻 Encerrando servidor...");
      server.close(() => {
        logger.info("Servidor encerrado com sucesso");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }
}
