"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const errors_1 = require("../../utils/errors");
const base_service_1 = require("../base/base.service");
const order_repository_1 = __importDefault(require("./order.repository"));
const cart_repository_1 = __importDefault(require("../cart/cart.repository"));
const inventory_repository_1 = __importDefault(require("../inventory/inventory.repository"));
const IdGenerator_1 = require("../../utils/IdGenerator");
const client_1 = require("@prisma/client");
class OrderService extends base_service_1.BaseService {
    constructor(repository, cartRepository, inventoryRepository, prisma) {
        super(repository);
        this.repository = repository;
        this.cartRepository = cartRepository;
        this.inventoryRepository = inventoryRepository;
        this.prisma = prisma;
    }
    async createOrder(payload, tx) {
        const { subTotalPrice, totalPrice, shippingCost, coupon, userRef, customerName, customerPhone, customerEmail, customerCity, customerAddress, customerAltPhone, paymentMethod, } = payload;
        console.log('Creating order with payload:', payload);
        if (!userRef)
            throw new errors_1.NotFoundError('User is required');
        if (!customerName)
            throw new errors_1.NotFoundError('Customer name is required');
        if (!customerPhone)
            throw new errors_1.NotFoundError('Customer phone is required');
        if (!customerCity)
            throw new errors_1.NotFoundError('Customer city is required');
        if (!paymentMethod)
            throw new errors_1.NotFoundError('Payment method is required');
        if (shippingCost == null || shippingCost == undefined)
            throw new errors_1.NotFoundError('Shipping cost is required');
        const orderId = await (0, IdGenerator_1.idGenerate)('ORD-', 'orderId', this.prisma.order);
        payload.orderId = String(orderId);
        console.log('Creating order with payload:', payload);
        const orderData = await this.repository.createOrder(payload, tx);
        return orderData;
    }
    async createAdminOrder(payload, tx) {
        var _a, _b, _c, _d;
        const { userRef, orders, warehouseRef, payment } = payload;
        let paymentResult = null;
        // if (payment > 0) {
        //   paymentResult = await this.prisma.payment.create({
        //     data: {
        //       amount: payment,
        //       userRef: userRef,
        //       warehouseRef: warehouseRef,
        //     },
        //   });
        //   payload.paymentRef = [paymentResult.id];
        // }
        if (!warehouseRef)
            throw new errors_1.NotFoundError('Warehouse is required');
        let productIds = [];
        let totalPrice = 0;
        let subTotalPrice = 0;
        let totalDiscount = 0;
        for (const order of orders) {
            const productInfo = await this.inventoryRepository.findProductInfo(order);
            productIds.push({
                productRef: (_a = productInfo === null || productInfo === void 0 ? void 0 : productInfo.productRef) === null || _a === void 0 ? void 0 : _a.id,
                inventoryRef: order === null || order === void 0 ? void 0 : order.inventoryID,
                quantity: order === null || order === void 0 ? void 0 : order.quantity,
                color: productInfo === null || productInfo === void 0 ? void 0 : productInfo.name,
                level: productInfo === null || productInfo === void 0 ? void 0 : productInfo.level,
                productDiscount: order === null || order === void 0 ? void 0 : order.discount,
            });
            totalPrice += ((_b = productInfo === null || productInfo === void 0 ? void 0 : productInfo.productRef) === null || _b === void 0 ? void 0 : _b.mrpPrice) * Number(order === null || order === void 0 ? void 0 : order.quantity);
            totalDiscount += Number(order === null || order === void 0 ? void 0 : order.discount) * Number(order === null || order === void 0 ? void 0 : order.quantity) || 0;
            subTotalPrice +=
                ((_c = productInfo === null || productInfo === void 0 ? void 0 : productInfo.productRef) === null || _c === void 0 ? void 0 : _c.mrpPrice) * Number(order === null || order === void 0 ? void 0 : order.quantity) -
                    totalDiscount || 0;
            const availableQuantity = (productInfo === null || productInfo === void 0 ? void 0 : productInfo.availableQuantity) || 0;
            const quantityToHold = Number(order === null || order === void 0 ? void 0 : order.quantity);
            if (availableQuantity < quantityToHold) {
                throw new Error(`Insufficient stock for product ${(_d = productInfo === null || productInfo === void 0 ? void 0 : productInfo.productRef) === null || _d === void 0 ? void 0 : _d.name}`);
            }
            const inventoryID = order === null || order === void 0 ? void 0 : order.inventoryID;
            const inventoryPayload = {
                availableQuantity: availableQuantity - quantityToHold,
                holdQuantity: Number(productInfo === null || productInfo === void 0 ? void 0 : productInfo.holdQuantity) + quantityToHold,
            };
            await this.inventoryRepository.inventoryOrderPlace(inventoryID, inventoryPayload);
        }
        payload.orders = productIds;
        payload.totalPrice = totalPrice;
        payload.subTotalPrice = subTotalPrice;
        payload.totalDiscount = totalDiscount;
        const orderData = await this.prisma.order.create({
            data: payload,
        });
        return orderData;
    }
    async getAllOrder() {
        return await this.repository.getAllOrder();
    }
    async getOrderProducts() {
        return await this.repository.getOrderProducts();
    }
    async getOrderWithPagination(payload) {
        const order = await this.repository.getOrderWithPagination(payload);
        return order;
    }
    async getIncompleteOrderWithPagination(payload) {
        const order = await this.repository.getIncompleteOrderWithPagination(payload);
        return order;
    }
    async getSingleOrder(id) {
        const orderData = await this.repository.getSingleOrder(id);
        if (!orderData)
            throw new errors_1.NotFoundError('Order Not Find');
        return orderData;
    }
    async getUserAllOrder(id) {
        const isObjectId = /^[a-f\d]{24}$/i.test(id);
        const query = {};
        if (!isObjectId) {
            query.correlationId = id;
        }
        else {
            query.userRef = id;
        }
        // const orderData = await this.repository.findAll(query, ['products.productRef']);
        // if (!orderData) throw new NotFoundError('Order Not Find');
        // return orderData;
    }
    async orderTracking(payload) {
        const { orderId } = payload;
        const orderData = await this.repository.orderTracking({ orderId: orderId });
        if (!orderData)
            throw new errors_1.NotFoundError('Order Not Find');
        return orderData;
    }
    async updateOrder(id, payload) {
        const orderData = await this.repository.updateOrder(Number(id), payload);
        return orderData;
    }
    async updateOrderStatus(id, status, tx) {
        if (!status)
            throw new errors_1.NotFoundError('Status is required');
        const orderData = await this.repository.getSingleOrder(id);
        if (!orderData)
            throw new errors_1.NotFoundError('Order not found');
        await this.inventoryRepository.updateInventoryStatus(status, orderData, tx);
        const order = await this.repository.updateOrderStatus(Number(id), status);
        if (!order)
            throw new errors_1.NotFoundError('Order not found');
        return order;
    }
    async isCourierSending(id, tx) {
        const orderData = await this.repository.getSingleOrder(id);
        if (!orderData)
            throw new errors_1.NotFoundError('Order not found');
        // const order = await this.repository.updateById(id, { isCourierSend: true }, tx);
        // if (!order) throw new NotFoundError('Order not found');
        // return order;
    }
    async deleteOrder(id, tx) {
        const order = await this.repository.getSingleOrder(id);
        if (!order)
            throw new errors_1.NotFoundError('Order not found');
        // for (const product of order?.products) {
        //   const inventoryRef = product?.inventoryRef;
        //   const inventory = await this.inventoryRepository.findById(inventoryRef);
        //   let inventoryPayload: any = {};
        //   if (order?.status == 'OrderPlaced') {
        //     inventoryPayload.availableQuantity =
        //       inventory?.availableQuantity + Number(product?.quantity);
        //     inventoryPayload.holdQuantity =
        //       inventory?.holdQuantity - Number(product?.quantity);
        //   } else if (order?.status == 'DeliveredPending') {
        //     inventoryPayload.availableQuantity =
        //       inventory?.availableQuantity + Number(product?.quantity);
        //     inventoryPayload.holdQuantity =
        //       inventory?.holdQuantity - Number(product?.quantity);
        //   } else if (order?.status == 'Delivered') {
        //     // no need to calculation, order delivered and money is also received
        //   } else if (order?.status == 'Cancelled') {
        //     // no need to calculation, order is cancelled
        //   } else if (order?.status == 'Hold') {
        //     inventoryPayload.availableQuantity =
        //       inventory?.availableQuantity + Number(product?.quantity);
        //     inventoryPayload.holdQuantity =
        //       inventory?.holdQuantity - Number(product?.quantity);
        //   } else if (order?.status == 'InReview') {
        //     inventoryPayload.availableQuantity =
        //       inventory?.availableQuantity + Number(product?.quantity);
        //     inventoryPayload.holdQuantity =
        //       inventory?.holdQuantity - Number(product?.quantity);
        //   }
        //   await this.inventoryRepository.inventoryOrderPlace(
        //     inventoryRef,
        //     inventoryPayload,
        //     tx
        //   );
        // }
        // const deletedOrder = await this.repository.deleteById(id, tx);
        // return deletedOrder;
    }
}
exports.OrderService = OrderService;
const prisma = new client_1.PrismaClient();
exports.default = new OrderService(order_repository_1.default, cart_repository_1.default, inventory_repository_1.default, prisma);
