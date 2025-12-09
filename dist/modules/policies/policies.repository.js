"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const pagination_1 = require("../../utils/pagination");
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
        this.getPolicyByPolicyTypeIdRepository = async (id) => {
            const policy = await this.prisma.policies.findFirst({
                where: { policyTypeId: id },
            });
            return policy;
        };
        this.getPolicyByIdRepository = async (id) => {
            const policy = await this.prisma.policies.findUnique({
                where: { id: id },
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
        this.addUnhelpfulCount = async (id, notHelpfulCount) => {
            const updatedPolicy = await this.prisma.policies.update({
                where: { id: id },
                data: { notHelpfulCount: notHelpfulCount },
            });
            return updatedPolicy;
        };
    }
    async getPolicesWithPagination(payload, tx) {
        const { limit, offset } = payload;
        const prismaClient = tx || this.prisma;
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.policyType.findMany({
                    where: {},
                    skip: offset,
                    take: limit,
                }),
                prismadatabase_1.default.policyType.count({ where: {} }),
            ]);
            return { doc, totalDoc };
        });
    }
    async addHelpfulCount(id, helpfulCount) {
        return await this.prisma.policies.update({
            where: { id: id },
            data: {
                helpfulCount: helpfulCount
            }
        });
    }
})();
