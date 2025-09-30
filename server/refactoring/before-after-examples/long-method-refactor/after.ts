export class App {
  // ... outros methods ...

  public listen(): void {
    const server = this.app.listen(this.port, () => {
      console.log(`✅ Server running at http://localhost:${this.port}`);
    });

    this.setupGracefulShutdown(server);
  }

  private setupGracefulShutdown(server: any): void {
    const shutdown = () => {
      console.log("🔻 Shutting down...");
      server.close(() => process.exit(0));
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }
}
