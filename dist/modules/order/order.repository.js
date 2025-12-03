"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class OrderRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
}
exports.default = new OrderRepository(new client_1.PrismaClient());
