"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const base_service_1 = require("../base/base.service");
const order_repository_1 = __importDefault(require("./order.repository"));
const cart_repository_1 = __importDefault(require("../cart/cart.repository"));
const client_1 = require("@prisma/client");
class OrderService extends base_service_1.BaseService {
    constructor(repository, cartRepository, 
    // inventoryRepository: any,
    prisma) {
        super(repository);
        this.repository = repository;
        this.cartRepository = cartRepository;
        // this.inventoryRepository = inventoryRepository;
        this.prisma = prisma;
    }
}
exports.OrderService = OrderService;
const prisma = new client_1.PrismaClient();
exports.default = new OrderService(order_repository_1.default, cart_repository_1.default, prisma);
