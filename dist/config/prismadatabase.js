"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Create a single instance of PrismaClient
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Optional: logging enable
});
// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
exports.default = prisma;
