"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../utils/errors");
const pagination_1 = require("../../utils/pagination");
const responseHandler_1 = require("../../utils/responseHandler");
const slugGenerate_1 = require("../../utils/slugGenerate");
const policies_repository_1 = __importDefault(require("./policies.repository"));
exports.default = new (class PoliciesService {
    constructor() {
        this.getAllPolicyTitles = async () => {
            try {
                const { allPolicies, allPolicyTypes } = await policies_repository_1.default.getAllPolicyTitlesRepository();
                if (!allPolicies || !allPolicyTypes) {
                    const error = new Error(`Something went wrong. Policies not Found.`);
                    error.statusCode = 400;
                    throw error;
                }
                const transformedData = allPolicyTypes.map((policyType) => {
                    const relatedPolicies = allPolicies.filter((policy) => policy.policyTypeId === policyType.id);
                    return {
                        id: policyType.slug,
                        title: policyType.title,
                        submenus: relatedPolicies.map((policy) => ({
                            id: policy.id,
                            title: policy.title,
                            createdAt: policy.createdAt,
                            updatedAt: policy.updatedAt,
                        })),
                    };
                });
                return transformedData;
            }
            catch (error) {
                console.error("Error getting policy titles:", error);
                throw error;
            }
        };
        this.getSinglePolicyById = async (id) => {
            try {
                if (!id) {
                    const error = new Error("Policy ID is missing.");
                    error.statusCode = 400;
                    throw error;
                }
                const policy = await policies_repository_1.default.getSinglePolicyByIdRepository(id);
                if (!policy) {
                    const error = new Error(`No policy found for ID ${id}`);
                    error.statusCode = 404;
                    throw error;
                }
                return policy;
            }
            catch (error) {
                console.error("Error getting policy by ID:", error);
                throw error;
            }
        };
        this.updatePolicyType = async (slug, body) => {
            let policyType;
            if (!slug) {
                const error = new Error("Policy type slug is Missing.");
                error.statusCode = 400;
                throw error;
            }
            else {
                policyType = await policies_repository_1.default.getPolicyTypeBySlugRepository(slug);
                if (!policyType) {
                    const error = new Error("Policy type not found");
                    error.statusCode = 404;
                    throw error;
                }
            }
            try {
                const updatedPolicyType = await policies_repository_1.default.updatePolicyTypeRepository(policyType.slug, body);
                return updatedPolicyType;
            }
            catch (error) {
                console.error("Error updating policy type:", error);
                throw error;
            }
        };
        this.deletePolicyType = async (slug) => {
            let policyType;
            if (!slug) {
                const error = new Error("Policy type is Missing.");
                error.statusCode = 400;
                throw error;
            }
            else {
                policyType = await policies_repository_1.default.getPolicyTypeBySlugRepository(slug);
                if (!policyType) {
                    const error = new Error("Policy type not found");
                    error.statusCode = 404;
                    throw error;
                }
            }
            try {
                const policyExistWithCurrentType = await policies_repository_1.default.getPolicyByPolicyTypeIdRepository(policyType.id);
                console.log("🚀 ~ policies.service.ts:108 ~ policyExistWithCurrentType:", policyExistWithCurrentType);
                if (policyExistWithCurrentType) {
                    const error = new Error("Cannot delete policy type. Policies exist with this type.");
                    error.statusCode = 400;
                    throw error;
                }
                else {
                    return await policies_repository_1.default.deletePolicyTypeRepository(slug);
                }
            }
            catch (error) {
                console.error("Error deleting policy type:", error);
                throw error;
            }
        };
        this.getAllPolicyTableView = async (payload) => {
            try {
                return await (0, pagination_1.pagination)(payload, async (limit, offset) => {
                    const [policies, totalDoc] = await Promise.all([
                        policies_repository_1.default.getAllPolicyRepository({
                            limit,
                            offset,
                            order: payload.order,
                        }),
                        policies_repository_1.default.getAllPoliciesCount(),
                    ]);
                    if (!policies || policies.length === 0) {
                        return { doc: [], totalDoc };
                    }
                    const doc = await Promise.all(policies.map(async (policy) => {
                        var _a, _b;
                        // policyType should be fetched by the policy's `policyTypeId`, not the policy's own id
                        const policyType = await policies_repository_1.default.getPolicyTypeByIdRepository(policy.policyTypeId);
                        return {
                            id: policy.id,
                            title: policy.title,
                            description: policy.description,
                            policyTypeId: policy.policyTypeId,
                            policyType: (_a = policyType === null || policyType === void 0 ? void 0 : policyType.title) !== null && _a !== void 0 ? _a : null,
                            policyTypeSlug: (_b = policyType === null || policyType === void 0 ? void 0 : policyType.slug) !== null && _b !== void 0 ? _b : null,
                            helpfulCount: policy.helpfulCount,
                            notHelpfulCount: policy.notHelpfulCount,
                            createdAt: policy.createdAt,
                            updatedAt: policy.updatedAt,
                        };
                    }));
                    return { doc, totalDoc };
                });
            }
            catch (error) {
                console.error("Error getting policy table view:", error);
                throw error;
            }
        };
        this.getAllPolicyTypes = async () => {
            try {
                const allPolicyTypes = await policies_repository_1.default.getAllPolicyTypesRepository();
                return allPolicyTypes;
            }
            catch (error) {
                console.error("Error getting policy types:", error);
                throw error;
            }
        };
        this.getPolicyTypesWithPagination = async (payload) => {
            const { page, limit } = payload;
            const policyTypes = await policies_repository_1.default.getPolicyTypesWithPagination({ limit, page });
            return policyTypes;
        };
        this.getAllPoliciesCount = async () => {
            try {
                return await policies_repository_1.default.getAllPoliciesCount();
            }
            catch (e) {
                console.error(e);
                const error = new Error("Failed to fetch policies count");
                error.statusCode = 500;
                throw error;
            }
        };
        this.createPolicy = async (payload) => {
            console.log("🚀 ~ policies.service.ts:196 ~ payload:", payload);
            const { title, description, policyTypeId } = payload;
            if (!title || !policyTypeId || !description) {
                const missingFields = [];
                if (!title)
                    missingFields.push("title");
                if (!policyTypeId)
                    missingFields.push("policyTypeId");
                if (!description)
                    missingFields.push("description");
                const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
                error.statusCode = 400;
                throw error;
            }
            try {
                const existingPolicy = await policies_repository_1.default.isPolicyExist(title);
                if (existingPolicy) {
                    const error = new Error(`Policy with title "${title}" already exists`);
                    error.statusCode = 409; // Conflict
                    throw error;
                }
                const policyPayload = {
                    title,
                    description,
                    policyTypeId,
                };
                const policy = await policies_repository_1.default.createPolicyRepository(policyPayload);
                return policy;
            }
            catch (error) {
                console.error("Error creating policy:", error);
                throw error;
            }
        };
        this.createPolicyType = async (payload) => {
            const missingFields = [];
            if (!payload.title)
                missingFields.push("title");
            if (missingFields.length > 0) {
                const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
                error.statusCode = 400;
                throw error;
            }
            const { title } = payload;
            const slug = (0, slugGenerate_1.slugGenerate)(title);
            try {
                const policyType = await policies_repository_1.default.createPolicyTypeRepository({
                    title,
                    slug,
                });
                return policyType;
            }
            catch (error) {
                console.error("Error creating policy type:", error);
                throw error;
            }
        };
        // createPolicyType = async ( payload: CreatePolicyTypeRequestDTO ): Promise<any> => {
        //   const { title } = payload;
        //   const slug = slugGenerate(title);
        //   if (!title || !slug) {
        //     const missingFields: string[] = [];
        //     if (!title) missingFields.push("title");
        //     if (!slug) missingFields.push("slug");
        //     const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
        //     (error as any).statusCode = 400;
        //     throw error;
        //   }
        //   try {
        //     const policyType = await policiesRepository.createPolicyTypeRepository({ title, slug});
        //     return policyType;
        //   } catch (error: any) {
        //     console.error("Error creating policy type:", error);
        //   }
        // };
        this.getPolicyById = async (slug) => {
            try {
                const policyType = await policies_repository_1.default.getPolicyTypeBySlugRepository(slug);
                if (policyType) {
                    try {
                        const { id } = policyType;
                        const policy = await policies_repository_1.default.getPolicyByPolicyTypeIdRepository(id);
                        return policy;
                    }
                    catch (error) {
                        console.error("Error finding policy:", error);
                        throw error;
                    }
                }
                else {
                    throw new errors_1.NotFoundError(`No policy found for policyId ${slug}`);
                }
            }
            catch (error) {
                console.error("Error finding policy:", error);
                throw error;
            }
        };
        this.updatePolicy = async (slug, body) => {
            try {
                const missingFields = [];
                if (!body.title)
                    missingFields.push("title");
                if (!body.description)
                    missingFields.push("description");
                if (!body.policyTypeId)
                    missingFields.push("policy Type Id");
                if (missingFields.length > 0) {
                    const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
                    error.statusCode = 400;
                    throw error;
                }
                const isPolicyTypeExist = await policies_repository_1.default.getPolicyTypeByIdRepository(body.policyTypeId);
                if (!isPolicyTypeExist) {
                    const error = new Error("Policy type not found");
                    error.statusCode = 404;
                    throw error;
                }
                const isPolicyExist = await policies_repository_1.default.getPolicyByIdRepository(body.id);
                if (!isPolicyExist) {
                    const error = new Error("Policy not found");
                    error.statusCode = 404;
                    throw error;
                }
                const update = await policies_repository_1.default.updatePolicyRepository(body.id, body);
                return update;
            }
            catch (error) {
                console.error("Error updating policy:", error);
                throw error;
            }
        };
        this.deletePolicy = async (paramId) => {
            try {
                const id = parseInt(paramId);
                if (!id) {
                    const error = new Error("Missing required field: id");
                    error.statusCode = 400;
                    throw error;
                }
                const policy = await policies_repository_1.default.getPolicyByIdRepository(id);
                if (!policy) {
                    const error = new Error("Policy not found");
                    error.statusCode = 404;
                    throw error;
                }
                return await policies_repository_1.default.deletePolicyRepository(id);
            }
            catch (error) {
                console.error("Error deleting policy:", error);
                throw error;
            }
        };
        this.addHelpfulCount = async (id) => {
            try {
                if (!id) {
                    const error = new Error("Missing required field: id");
                    error.statusCode = 400;
                    throw error;
                }
                const policy = await policies_repository_1.default.getPolicyByIdRepository(id);
                if (!policy) {
                    const error = new Error(`Policy not found for id ${id}`);
                    error.statusCode = 404;
                    throw error;
                }
                const { id: policyId, title, description, policyTypeId, helpfulCount: helpfulCounter, notHelpfulCount, createdAt, updatedAt } = policy;
                const payload = { id: policyId, title, description, policyTypeId, helpfulCount: helpfulCounter, notHelpfulCount, createdAt, updatedAt };
                if ((payload === null || payload === void 0 ? void 0 : payload.helpfulCount) == null) {
                    const error = new Error("Missing required field: helpfulCount");
                    error.statusCode = 400;
                    throw error;
                }
                payload.helpfulCount = payload.helpfulCount + 1;
                const { helpfulCount } = payload;
                const updated = await policies_repository_1.default.addHelpfulCount(id, helpfulCount);
                return (0, responseHandler_1.responseHandler)(200, "Helpful count updated successfully", updated);
            }
            catch (error) {
                console.error("Error updating helpful count:", error);
                throw error;
            }
        };
        this.addUnhelpfulCount = async (id) => {
            try {
                if (!id) {
                    const error = new Error("Missing required field: id");
                    error.statusCode = 400;
                    throw error;
                }
                const policy = await policies_repository_1.default.getPolicyByIdRepository(id);
                if (!policy) {
                    const error = new Error(`Policy not found for id ${id}`);
                    error.statusCode = 404;
                    throw error;
                }
                const { id: policyId, title, description, policyTypeId, helpfulCount, notHelpfulCount: unhelpfulCounter, createdAt, updatedAt } = policy;
                const payload = {
                    id: policyId,
                    title,
                    description,
                    policyTypeId,
                    helpfulCount,
                    notHelpfulCount: unhelpfulCounter,
                    createdAt,
                    updatedAt,
                };
                if ((payload === null || payload === void 0 ? void 0 : payload.notHelpfulCount) == null) {
                    const error = new Error("Missing required field: notHelpfulCount");
                    error.statusCode = 400;
                    throw error;
                }
                payload.notHelpfulCount = payload.notHelpfulCount + 1;
                const { notHelpfulCount } = payload;
                const updated = await policies_repository_1.default.addUnhelpfulCount(id, notHelpfulCount);
                return (0, responseHandler_1.responseHandler)(200, "Unhelpful count updated successfully", updated);
            }
            catch (error) {
                console.error("Error updating unhelpful count:", error);
                throw error;
            }
        };
    }
    async getPolicesWithPagination(payload, tx) {
        const { page, limit } = payload;
        const offset = (page - 1) * limit;
        const policyTypes = await policies_repository_1.default.getPolicesWithPagination({ limit, offset }, tx);
        return policyTypes;
    }
})();
