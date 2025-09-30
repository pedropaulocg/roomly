// app.ts
export class App {
  public listen(): void {
    const server = this.app.listen(this.port, () => {
      console.log(`✅ Server running at http://localhost:${this.port}`);
    });

    const shutdown = () => {
      console.log("🔻 Shutting down...");
      server.close(() => process.exit(0));
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }

  private errorHandler(): void {
    this.app.use(
      (err: any, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err instanceof Error ? err : String(err));
        res
          .status(err.status || 500)
          .json({ message: err.message || "Internal Server Error" });
      }
    );
  }
}

// prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

export { prisma };
