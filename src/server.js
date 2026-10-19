const app = require("./app");
const config = require("./config");
const { connectDB, disconnectDB } = require("./config/db");

async function start() {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port} (${config.env})`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
