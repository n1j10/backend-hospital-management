const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");
const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");

// Connect through Neon's WebSocket proxy (port 443) instead of raw TCP on 5432,
// which is blocked on some networks.
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaNeon(pool) });

async function connectDB() {
  await prisma.$queryRaw`SELECT 1`;
  console.log("Database connected");
}

async function disconnectDB() {
  await prisma.$disconnect();
}

module.exports = { prisma, connectDB, disconnectDB };
