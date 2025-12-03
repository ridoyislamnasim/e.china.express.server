"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
exports.default = new (class PoliciesRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
        this.getAllPolicyTitlesRepository = async () => {
            const allPolicyTypes = await this.prisma.policyType.findMany();
            const allPolicies = await this.prisma.policies.findMany();
            return { allPolicies, allPolicyTypes };
        };
        this.getPolicyTypeBySlugRepository = async (slug) => {
            const policyType = await this.prisma.policyType.findFirst({
                where: { slug: slug },
            });
            return policyType;
        };
        this.getPolicyByIdRepository = async (id) => {
            const policy = await this.prisma.policies.findFirst({
                where: { policyTypeId: id },
            });
            return policy;
        };
        this.createPolicyRepository = async (body) => {
            return await this.prisma.policies.create({
                data: {
                    title: body.title,
                    description: body.description,
                    policyTypeId: body.policyTypeId,
                },
            });
        };
        this.createPolicyTypeRepository = async (body) => {
            return await this.prisma.policyType.create({
                data: {
                    title: body.title,
                    slug: body.slug,
                },
            });
        };
        this.isPolicyExist = async (title) => {
            return await this.prisma.policies.findFirst({
                where: { title: title },
            });
        };
        this.updatePolicyRepository = async (policyId, body) => {
            return await this.prisma.policies.update({
                where: { id: policyId },
                data: {
                    title: body.title,
                    description: body.description,
                },
            });
        };
        this.deletePolicyRepository = async (id) => {
            return await this.prisma.policies.delete({
                where: { id },
            });
        };
    }
})();
