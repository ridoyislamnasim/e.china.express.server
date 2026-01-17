import prisma from "../../config/prismadatabase";
import { CreatePolicyRequestDTO, PolicyRequestDTO, PolicyTypeI } from "../../types/policy";
import { pagination } from "../../utils/pagination";
import { slugGenerate } from "../../utils/slugGenerate";

export default new (class PoliciesRepository {
  private prisma = prisma;

  getAllPolicyTypesRepository = async (): Promise<PolicyTypeI[] | []> => {
    const allPolicyTypes = await this.prisma.policyType.findMany();
    return allPolicyTypes;
  };

  getAllPolicyTitlesRepository = async () => {
    const allPolicyTypes = await this.prisma.policyType.findMany();
    const allPolicies = await this.prisma.policies.findMany({
      select: {
        id: true,
        title: true,
        policyTypeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { allPolicies, allPolicyTypes };
  };

  getSinglePolicyByIdRepository = async (id: string) => {
    const policyId = parseInt(id, 10);
    const policy = await this.prisma.policies.findUnique({
      where: { id: policyId },
    });
    return policy;
  };

  getAllPoliciesCount = async () => {
    const policiesCount = await this.prisma.policies.count();
    return policiesCount;
  };

  updatePolicyTypeRepository = async (slug: string, payload: { title: string; id: number }): Promise<any> => {
    return await this.prisma.policyType.updateMany({
      where: { slug: slug },
      data: {
        slug: slugGenerate(payload.title),
        title: payload.title,
        id: payload.id,
      },
    });
  };

  getPolicyTypesWithPagination = async (payload: any): Promise<any> => {
    const result = await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.policyType.findMany({
          skip: offset,
          take: limit,

          orderBy: { createdAt: sortOrder },
        }),
        this.prisma.policyType.count({}),
      ]);

      return { doc, totalDoc };
    });

    return result;
  };

  getAllPolicyRepository = async ({ limit, offset, order = "desc" }: { limit: number; offset: number; order?: "asc" | "desc" }) => {
    const policies = await this.prisma.policies.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: order },
    });

    const mappedPolicies = policies.map((policy) => ({
      ...policy,
    }));

    return mappedPolicies;
  };

  getPolicyTypeByIdRepository = async (id: number) => {
    const policyType = await this.prisma.policyType.findUnique({
      where: { id: id },
    });
    return policyType;
  };

  getPolicyTypeBySlugRepository = async (slug: string) => {
    const policyType = await this.prisma.policyType.findFirst({
      where: { slug: slug },
    });
    return policyType;
  };

  getPolicyByPolicyTypeIdRepository = async (id: number) => {
    const policy = await this.prisma.policies.findFirst({
      where: { policyTypeId: id },
    });
    return policy;
  };

  deletePolicyTypeRepository = async (slug: string) => {
    const policyType = await this.prisma.policyType.deleteMany({
      where: { slug: slug },
    });
    return policyType;
  };

  getPolicyByIdRepository = async (id: number) => {
    const policy = await this.prisma.policies.findUnique({
      where: { id: id },
    });
    return policy;
  };

  createPolicyRepository = async (body: CreatePolicyRequestDTO): Promise<any> => {
    return await this.prisma.policies.create({
      data: {
        title: body.title,
        description: body.description,
        policyTypeId: body.policyTypeId,
      },
    });
  };

  createPolicyTypeRepository = async (body: { title: string; slug: string }): Promise<any> => {
    return await this.prisma.policyType.create({
      data: {
        title: body.title,
        slug: body.slug,
      },
    });
  };

  isPolicyExist = async (title: string): Promise<any> => {
    return await this.prisma.policies.findFirst({
      where: { title: title },
    });
  };

  updatePolicyRepository = async (policyId: number, body: Partial<PolicyRequestDTO>): Promise<any> => {
    return await this.prisma.policies.update({
      where: { id: policyId },
      data: {
        title: body.title,
        description: body.description,
        policyTypeId: body.policyTypeId,
      },
    });
  };

  deletePolicyRepository = async (id: number) => {
    return await this.prisma.policies.delete({
      where: { id },
    });
  };

  async getPolicesWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.policyType.findMany({
          where: {},
          skip: offset,
          take: limit,
        }),
        prisma.policyType.count({ where: {} }),
      ]);
      return { doc, totalDoc };
    });
  }

  async addHelpfulCount(id: number, helpfulCount: number) {
    return await this.prisma.policies.update({
      where: { id: id },
      data: {
        helpfulCount: helpfulCount,
      },
    });
  }

  addUnhelpfulCount = async (id: number, notHelpfulCount: number): Promise<any> => {
    const updatedPolicy = await this.prisma.policies.update({
      where: { id: id },
      data: { notHelpfulCount: notHelpfulCount },
    });
    return updatedPolicy;
  };
})();
