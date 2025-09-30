import "dotenv/config";
import { App } from "./app";
import { connectDB } from "./config/prisma";
import { logger } from "./utils/logger";

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  try {
    logger.info("Iniciando aplicação...");
    await connectDB();

    const server = new App(PORT);
    server.listen();
  } catch (error) {
    logger.error("Erro ao inicializar aplicação:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

bootstrap();
