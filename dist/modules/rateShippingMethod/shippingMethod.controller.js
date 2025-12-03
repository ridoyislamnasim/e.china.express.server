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
            try {
                const { name, description } = req.body;
                const payload = {
                    name,
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
    }
}
exports.default = new RateShippingMethodController();
