"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../../utils/responseHandler");
const rateWeightCategories_service_1 = require("./rateWeightCategories.service");
const rateWeightCategories_repository_1 = __importDefault(require("./rateWeightCategories.repository"));
const rateWeightCategoriesService = new rateWeightCategories_service_1.RateWeightCategoriesService(rateWeightCategories_repository_1.default);
class RateWeightCategoriesController {
    constructor() {
        this.createRateWeightCategories = async (req, res, next) => {
            try {
                const { label, min_weight, max_weight } = req.body;
                const payload = {
                    label, min_weight, max_weight
                };
                const shippingMethod = await rateWeightCategoriesService.createRateWeightCategories(payload);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Rate weight categories created successfully', shippingMethod);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllRateWeightCategories = async (req, res, next) => {
            try {
                const rateWeightCategories = await rateWeightCategoriesService.getAllRateWeightCategories();
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate weight categories retrieved successfully', rateWeightCategories);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
    }
    async getRateWeightCategoriesWithPagination(req, res, next) {
        try {
            let payload = {
                page: Number(req.query.page),
                limit: Number(req.query.limit),
                order: req.query.order,
            };
            const rateWeightCategories = await rateWeightCategoriesService.getRateWeightCategoriesWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate weight categories retrieved successfully', { ...rateWeightCategories });
            res.status(resDoc.statusCode).json(resDoc);
        }
        catch (error) {
            next(error);
        }
    }
    async updateRateWeightCategories(req, res, next) {
        const { id } = req.params;
        const { label, min_weight, max_weight } = req.body;
        const payload = {
            label, min_weight, max_weight
        };
        const updatedCategory = await rateWeightCategoriesService.updateRateWeightCategories(id, payload);
        const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate weight categories updated successfully', updatedCategory);
        res.status(resDoc.statusCode).json(resDoc);
    }
    async deleteRateWeightCategories(req, res, next) {
        try {
            const { id } = req.params;
            const deletedCategory = await rateWeightCategoriesService.deleteRateWeightCategories(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate weight categories deleted successfully', deletedCategory);
            res.status(resDoc.statusCode).json(resDoc);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new RateWeightCategoriesController();
