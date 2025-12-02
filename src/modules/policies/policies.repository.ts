import prisma from "../../config/prismadatabase";
import { CreatePolicyRequestDTO, CreatePolicyTypeRequestDTO, PolicyRequestDTO } from "../../types/policy";

export default new (class PoliciesRepository {
  private prisma = prisma;

  getAllPolicyTitlesRepository = async () => {
    const allPolicyTypes = await this.prisma.policyType.findMany();
    const allPolicies = await this.prisma.policies.findMany();

    return { allPolicies, allPolicyTypes };
  };

  getPolicyTypeBySlugRepository = async (slug: string) => {
    const policyType = await this.prisma.policyType.findFirst({
      where: { slug: slug },
    });
    return policyType;
  };

  getPolicyByIdRepository = async (id: number) => {
    const policy = await this.prisma.policies.findFirst({
      where: { policyTypeId: id },
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
      },
    });
  };

  deletePolicyRepository = async (id: number) => {
    return await this.prisma.policies.delete({
      where: { id },
    });
  };
})();
