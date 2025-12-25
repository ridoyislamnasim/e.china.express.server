"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const policies_service_1 = __importDefault(require("./policies.service"));
const responseHandler_1 = require("../../utils/responseHandler");
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
exports.default = new (class PoliciesController {
    constructor() {
        this.getAllPolicyTitles = (0, catchError_1.default)(async (req, res) => {
            const getAllPolicies = await policies_service_1.default.getAllPolicyTitles();
            const getAllPoliciesCount = await policies_service_1.default.getAllPoliciesCount();
            const resDoc = (0, responseHandler_1.responseHandler)(201, "All policies fetched successfully.", { data: getAllPolicies, count: getAllPoliciesCount });
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllPolicyTableView = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 10,
                order: req.query.order || "desc",
            };
            const policies = await policies_service_1.default.getAllPolicyTableView(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "All policies fetched successfully.", policies);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllPolicyTypes = (0, catchError_1.default)(async (req, res) => {
            const allPolicyTypes = await policies_service_1.default.getAllPolicyTypes();
            const resDoc = (0, responseHandler_1.responseHandler)(201, "All policy types fetched successfully.", allPolicyTypes);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSinglePolicyById = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const policy = await policies_service_1.default.getSinglePolicyById(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Policy fetched successfully.", policy);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deletePolicyType = (0, catchError_1.default)(async (req, res) => {
            const slug = req.params.slug;
            const result = await policies_service_1.default.deletePolicyType(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Policy fetched successfully.", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updatePolicyType = (0, catchError_1.default)(async (req, res) => {
            const slug = req.params.slug;
            const { title, id } = req.body;
            const payload = { title, id };
            const updated = await policies_service_1.default.updatePolicyType(slug, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Policy Type updated successfully.", updated);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getPolicyById = (0, catchError_1.default)(async (req, res) => {
            const slug = req.params.slug;
            const policy = await policies_service_1.default.getPolicyById(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Policy fetched successfully.", policy);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.createPolicy = (0, catchError_1.default)(async (req, res) => {
            const newPolicy = await policies_service_1.default.createPolicy(req.body);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "New policy created successfully.", newPolicy);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.createPolicyType = (0, catchError_1.default)(async (req, res) => {
            const newPolicyType = await policies_service_1.default.createPolicyType(req.body);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "New policy type created successfully.", newPolicyType);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updatePolicy = (0, catchError_1.default)(async (req, res) => {
            const slug = req.params.slug;
            const { title, description, policyTypeId, policyTypeTitle, id } = req.body;
            const payload = { title, description, policyTypeId, policyTypeTitle, id };
            const updated = await policies_service_1.default.updatePolicy(slug, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Policy updated successfully.", updated);
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
            const data = await policies_service_1.default.getPolicesWithPagination({ page, limit }, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Policies retrieved successfully with pagination.", data);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getPolicyTypesWithPagination = (0, withTransaction_1.default)(async (req, res, next) => {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
            console.log("🚀 ~ policies.controller.ts:114 ~ limit:", limit);
            const data = await policies_service_1.default.getPolicyTypesWithPagination({ page, limit });
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Policy types retrieved successfully with pagination.", data);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.addHelpfulCount = (0, catchError_1.default)(async (req, res) => {
            const { id } = req.body;
            // res.send(id)
            const result = await policies_service_1.default.addHelpfulCount(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Policy Counted as helpful.", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.addUnhelpfulCount = (0, catchError_1.default)(async (req, res) => {
            const { id } = req.body;
            // res.send(id)
            const result = await policies_service_1.default.addUnhelpfulCount(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Policy Counted as unhelpful.", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
})();
