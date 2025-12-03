"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../utils/errors");
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
                            // id: slugGenerate(policy.title),
                            id: policy.id,
                            title: policy.title,
                            terms_html: policy.description,
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
        this.createPolicy = async (payload) => {
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
            const { title } = payload;
            if (!title) {
                const missingFields = [];
                if (!title)
                    missingFields.push("title");
                const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
                error.statusCode = 400;
                throw error;
            }
            const slug = (0, slugGenerate_1.slugGenerate)(title);
            try {
                const policyType = await policies_repository_1.default.createPolicyTypeRepository({ title, slug });
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
                        const policy = await policies_repository_1.default.getPolicyByIdRepository(id);
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
                if (missingFields.length > 0) {
                    const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
                    error.statusCode = 400;
                    throw error;
                }
                const policyType = await policies_repository_1.default.getPolicyTypeBySlugRepository(slug);
                if (!policyType) {
                    const error = new Error("Policy type not found");
                    error.statusCode = 404;
                    throw error;
                }
                const policy = await policies_repository_1.default.getPolicyByIdRepository(policyType.id);
                if (!policy) {
                    const error = new Error("Policy not found for this policy type");
                    error.statusCode = 404;
                    throw error;
                }
                const updatedPolicy = await policies_repository_1.default.updatePolicyRepository(policy.id, body);
                return {
                    message: "Policy updated successfully",
                    data: updatedPolicy,
                };
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
    }
})();
