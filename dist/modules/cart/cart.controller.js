"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const cart_service_1 = __importDefault(require("./cart.service"));
const cart_Zschema_1 = require("./cart.Zschema");
class CartController {
    constructor() {
        // Create a cart item
        this.createCartItem = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            var _a, _b, _c, _d;
            // Zschema validation can be added here if needed
            console.log("Request Body: ", req.body);
            const payload = cart_Zschema_1.cartSchema.parse(req.body);
            // attach authenticated user id to payload items safely
            const userRef = (_d = (_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_info_encrypted) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : null;
            if (Array.isArray(payload)) {
                // payload is an array of items - add userRef to each
                payload.forEach((p) => {
                    p.userRef = userRef;
                });
            }
            else {
                // single object payload
                payload.userRef = userRef;
            }
            // এখন payload safe
            console.log("Validated Payload: ", payload);
            const cartServiceResult = await cart_service_1.default.createCartItem(payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Cart created", cartServiceResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getUserCartByProductId = (0, catchError_1.default)(async (req, res, next) => {
            var _a, _b, _c, _d;
            const userRef = (_d = (_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_info_encrypted) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : null;
            const productId = req.params.id;
            const cartServiceResult = await cart_service_1.default.getUserCartByProductId(userRef, Number(productId));
            const resDoc = (0, responseHandler_1.responseHandler)(200, "User cart fetched", cartServiceResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.default = new CartController();
