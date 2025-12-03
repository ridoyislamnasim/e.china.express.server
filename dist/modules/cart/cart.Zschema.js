"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = exports.cartItemSchema = void 0;
const zod_1 = require("zod");
exports.cartItemSchema = zod_1.z.object({
    product1688Id: zod_1.z.number().optional(),
    productLocalId: zod_1.z.string().nullable(),
    productAlibabaId: zod_1.z.number().nullable(),
    skuId: zod_1.z.any().optional().nullable(),
    specId: zod_1.z.string().optional().nullable(),
    quantity: zod_1.z.number().optional(),
});
exports.cartSchema = zod_1.z.array(exports.cartItemSchema);
