require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

async function connectDB() {
    try {
        await prisma.$connect();
        console.log("✅ Prisma Connected Successfully");
    } catch (error) {
        console.error("❌ Prisma Connection Failed");
        console.error(error);
        process.exit(1);
    }
}

connectDB();

module.exports = prisma;