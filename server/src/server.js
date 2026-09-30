const app = require("./app");
const config = require("./config");
const connectDB = require("./db");
const { startNewsRefresh } = require("./jobs/refreshNews");
const { schedule: scheduleDigest } = require("./jobs/weeklyDigest");

async function startServer() {
  await connectDB();
  startNewsRefresh();
  scheduleDigest();
  app.listen(config.port, () => {
    console.info(`Express server listening on port ${config.port}.`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start Express server:", error.message);
  process.exit(1);
});