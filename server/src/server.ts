import "dotenv/config";
import { App } from "./app";
import { connectDB } from "./config/prisma";

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  await connectDB();

  const server = new App(PORT);
  server.listen();
}

bootstrap();
