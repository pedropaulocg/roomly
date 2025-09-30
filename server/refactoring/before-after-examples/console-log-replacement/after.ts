// logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export { logger };

// app.ts
import { logger } from "./utils/logger";

export class App {
  public listen(): void {
    const server = this.app.listen(this.port, () => {
      logger.info(`✅ Server running at http://localhost:${this.port}`);
    });

    const shutdown = () => {
      logger.info("🔻 Shutting down...");
      server.close(() => process.exit(0));
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }

  private errorHandler(): void {
    this.app.use(
      (err: any, _req: Request, res: Response, _next: NextFunction) => {
        logger.error("Unhandled error:", {
          error: err.message,
          stack: err.stack,
          url: _req.url,
          method: _req.method,
        });
        res
          .status(err.status || 500)
          .json({ message: err.message || "Internal Server Error" });
      }
    );
  }
}

// prisma.ts
import { PrismaClient } from "@prisma/client";
import { logger } from "./utils/logger";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

prisma.$on("query", (e) => {
  logger.debug("Database query executed", {
    query: e.query,
    params: e.params,
    duration: e.duration,
  });
});

export { prisma };
