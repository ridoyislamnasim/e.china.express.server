"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const policies_service_1 = __importDefault(require("./policies.service"));
const responseHandler_1 = require("../../utils/responseHandler");
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
exports.default = new class PoliciesController {
    constructor() {
        this.getAllPolicyTitles = (0, catchError_1.default)(async (req, res) => {
            const getAllPolicies = await policies_service_1.default.getAllPolicyTitles();
            const getAllPoliciesCount = await policies_service_1.default.getAllPoliciesCount();
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'All policies fetched successfully.', { data: getAllPolicies, count: getAllPoliciesCount });
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getPolicyById = (0, catchError_1.default)(async (req, res) => {
            const slug = req.params.slug;
            const policy = await policies_service_1.default.getPolicyById(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Policy fetched successfully.', policy);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.createPolicy = (0, catchError_1.default)(async (req, res) => {
            const newPolicy = await policies_service_1.default.createPolicy(req.body);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'New policy created successfully.', newPolicy);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.createPolicyType = (0, catchError_1.default)(async (req, res) => {
            const newPolicyType = await policies_service_1.default.createPolicyType(req.body);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'New policy type created successfully.', newPolicyType);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updatePolicy = (0, catchError_1.default)(async (req, res) => {
            const slug = req.params.slug;
            const updated = await policies_service_1.default.updatePolicy(slug, req.body);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Policy updated successfully.', updated);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deletePolicy = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.slug;
            await policies_service_1.default.deletePolicy(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, `Policy with id ${id} deleted successfully.`, null);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getPolicesWithPagination = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await policies_service_1.default.getPolicesWithPagination({ page, limit }, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Policies retrieved successfully with pagination.', result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.addHelpfulCount = (0, catchError_1.default)(async (req, res) => {
            const { id } = req.body;
            // res.send(id)
            const result = await policies_service_1.default.addHelpfulCount(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Policy Counted as helpful.', result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.addUnhelpfulCount = (0, catchError_1.default)(async (req, res) => {
            const { id } = req.body;
            // res.send(id)
            const result = await policies_service_1.default.addUnhelpfulCount(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Policy Counted as unhelpful.', result);
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
};
