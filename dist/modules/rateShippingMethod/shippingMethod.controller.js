"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../../utils/responseHandler");
const shippingMethod_service_1 = require("./shippingMethod.service");
const shippingMethod_repository_1 = __importDefault(require("./shippingMethod.repository"));
const rateShippingMethodService = new shippingMethod_service_1.ShippingMethodService(shippingMethod_repository_1.default);
class RateShippingMethodController {
    constructor() {
        this.createShippingMethod = async (req, res, next) => {
            var _a;
            try {
                const { name, description } = req.body;
                const payload = {
                    name,
                    boxSize: (_a = req.body.boxSize) !== null && _a !== void 0 ? _a : null,
                    cbmToKgRatio: req.body.cbmToKgRatio ? parseFloat(req.body.cbmToKgRatio) : undefined,
                    description: description !== null && description !== void 0 ? description : null
                };
                const shippingMethod = await rateShippingMethodService.createShippingMethod(payload);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Rate shipping method Created successfully', shippingMethod);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getShippingMethod = async (req, res, next) => {
            try {
                const shippingMethods = await rateShippingMethodService.getShippingMethod();
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate shipping methods retrieved successfully', shippingMethods);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getShippingMethodWithPagination = async (req, res, next) => {
            try {
                let payload = {
                    page: Number(req.query.page),
                    limit: Number(req.query.limit),
                    order: req.query.order,
                };
                const shippingMethods = await rateShippingMethodService.getShippingMethodWithPagination(payload);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate shipping methods retrieved successfully', { ...shippingMethods });
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSingleShippingMethod = async (req, res, next) => {
            try {
                const id = req.params.id;
                const shippingMethod = await rateShippingMethodService.getSingleShippingMethod(id);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate shipping method retrieved successfully', shippingMethod);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateShippingMethod = async (req, res, next) => {
            var _a, _b;
            try {
                const id = req.params.id;
                const payload = {
                    name: req.body.name,
                    boxSize: (_a = req.body.boxSize) !== null && _a !== void 0 ? _a : null,
                    cbmToKgRatio: req.body.cbmToKgRatio ? parseFloat(req.body.cbmToKgRatio) : undefined,
                    description: (_b = req.body.description) !== null && _b !== void 0 ? _b : null
                };
                await rateShippingMethodService.updateShippingMethod(id, payload);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate shipping method updated successfully');
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteShippingMethod = async (req, res, next) => {
            try {
                const id = req.params.id;
                await rateShippingMethodService.deleteShippingMethod(id);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate shipping method deleted successfully');
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new RateShippingMethodController();
