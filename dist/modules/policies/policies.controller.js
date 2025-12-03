"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const policies_service_1 = __importDefault(require("./policies.service"));
const responseHandler_1 = require("../../utils/responseHandler");
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
exports.default = new (class PoliciesController {
    constructor() {
        this.getAllPolicyTitles = (0, catchError_1.default)(async (req, res) => {
            const getAllPolicies = await policies_service_1.default.getAllPolicyTitles();
            res.send(getAllPolicies);
        });
        this.getPolicyById = (0, catchError_1.default)(async (req, res) => {
            const slug = req.params.slug;
            const policy = await policies_service_1.default.getPolicyById(slug);
            res.send(policy);
        });
        this.createPolicy = (0, catchError_1.default)(async (req, res, next) => {
            try {
                const newPolicy = await policies_service_1.default.createPolicy(req.body);
                const resDoc = (0, responseHandler_1.responseHandler)(201, "New Policy Created Successfully.", newPolicy);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.createPolicyType = (0, catchError_1.default)(async (req, res, next) => {
            const newPolicyType = await policies_service_1.default.createPolicyType(req.body);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "New Policy Type Created Successfully.", newPolicyType);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updatePolicy = (0, catchError_1.default)(async (req, res) => {
            const slug = req.params.slug;
            const body = req.body;
            const updatedPolicy = await policies_service_1.default.updatePolicy(slug, body);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Policy Updated Successfully.", updatedPolicy);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deletePolicy = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.slug;
            await policies_service_1.default.deletePolicy(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, `Policy with id ${id} deleted successfully`, null);
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
})();
