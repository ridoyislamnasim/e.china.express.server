"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const order_service_1 = __importDefault(require("./order.service"));
class OrderController {
    constructor() {
        this.createOrder = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { subTotalPrice, totalPrice, coupon, shippingCost, userRef, customerName, customerPhone, customerEmail, customerCity, customerAddress, customerHouse, customerRoad, customerThana, customerAltPhone, paymentMethod, note, } = req.body;
                const payload = {
                    subTotalPrice,
                    totalPrice,
                    shippingCost,
                    coupon,
                    userRef,
                    customerName,
                    customerPhone,
                    customerEmail,
                    customerCity,
                    customerAddress,
                    customerHouse,
                    customerRoad,
                    customerThana,
                    customerAltPhone,
                    paymentMethod,
                    note,
                };
                const orderResult = await order_service_1.default.createOrder(payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Order successfully', orderResult);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                if (error.message === 'OrderId must be unique') {
                    const resDoc = (0, responseHandler_1.responseHandler)(400, error.message);
                    res.status(resDoc.statusCode).json(resDoc);
                }
                else {
                    next(error);
                }
            }
        });
        this.createAdminOrder = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            var _a;
            const payload = {
                userRef: req.body.userRef,
                orders: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.order,
                warehouseRef: req.body.warehouseRef,
                payment: req.body.payment,
                note: req.body.note,
            };
            const orderResult = await order_service_1.default.createAdminOrder(payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Order Created successfully', orderResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllOrder = (0, catchError_1.default)(async (req, res) => {
            const orderResult = await order_service_1.default.getAllOrder();
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Orders', orderResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getOrderProducts = (0, catchError_1.default)(async (req, res) => {
            const orderResult = await order_service_1.default.getOrderProducts();
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Orders', orderResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getOrderWithPagination = (0, catchError_1.default)(async (req, res) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
                warehouseRef: req.query.warehouseRef,
            };
            const order = await order_service_1.default.getOrderWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Orders get successfully', order);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getIncompleteOrderWithPagination = (0, catchError_1.default)(async (req, res) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
                warehouseRef: req.query.warehouseRef,
            };
            const order = await order_service_1.default.getIncompleteOrderWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Orders get successfully', order);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleOrder = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const orderResult = await order_service_1.default.getSingleOrder(id);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single Order successfully', orderResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getUserAllOrder = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const orderResult = await order_service_1.default.getUserAllOrder(id);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'User All Order get successfully', orderResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.orderTracking = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                orderId: req.body.orderId,
            };
            const orderResult = await order_service_1.default.orderTracking(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'User Order get successfully', orderResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateOrder = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const payload = {
                orderId: req.body.orderId,
                subTotal: req.body.subTotal,
                total: req.body.total,
                status: req.body.status,
                coupon: req.body.coupon,
                userRef: req.body.userRef,
            };
            await order_service_1.default.updateOrder(id, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Order Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateOrderStatus = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const id = req.params.id;
            const status = req.body.status;
            await order_service_1.default.updateOrderStatus(id, status, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Order Status Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.isCourierSending = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const id = req.params.id;
            await order_service_1.default.isCourierSending(id, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Order Status Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteOrder = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const id = req.params.id;
            const orderResult = await order_service_1.default.deleteOrder(id, tx);
            // if (orderResult) {
            //   const resDoc = responseHandler(200, 'Order Deleted successfully');
            //   res.status(resDoc.statusCode).json(resDoc);
            // }
        });
    }
}
exports.default = new OrderController();
