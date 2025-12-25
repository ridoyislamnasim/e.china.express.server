import { CreatePolicyRequestDTO, CreatePolicyTypeRequestDTO, PoliciesI, PolicyRequestDTO, PolicyTypeI } from "../../types/policy";
import { NotFoundError } from "../../utils/errors";
import { pagination } from "../../utils/pagination";
import { responseHandler } from "../../utils/responseHandler";
import { slugGenerate } from "../../utils/slugGenerate";
import policiesRepository from "./policies.repository";

export default new (class PoliciesService {
  getAllPolicyTitles = async () => {
    try {
      const { allPolicies, allPolicyTypes } = await policiesRepository.getAllPolicyTitlesRepository();

      if (!allPolicies || !allPolicyTypes) {
        const error = new Error(`Something went wrong. Policies not Found.`);
        (error as any).statusCode = 400;
        throw error;
      }
      const transformedData = allPolicyTypes.map((policyType) => {
        const relatedPolicies = allPolicies.filter((policy) => policy.policyTypeId === policyType.id);
        // console.log("🚀 ~ policies.service.ts:19 ~ relatedPolicies:", relatedPolicies);

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
    } catch (error) {
      console.error("Error getting policy titles:", error);
      throw error;
    }
  };

  getSinglePolicyById = async (id: string) => {
    try {
      if (!id) {
        const error = new Error("Policy ID is missing.");
        (error as any).statusCode = 400;
        throw error;
      }
      const policy = await policiesRepository.getSinglePolicyByIdRepository(id);
      if (!policy) {
        const error = new Error(`No policy found for ID ${id}`);
        (error as any).statusCode = 404;
        throw error;
      }
      return policy;
    } catch (error) {
      console.error("Error getting policy by ID:", error);
      throw error;
    }
  };

  updatePolicyType = async (slug: string, body: { title: string; id: number }) => {
    let policyType;
    if (!slug) {
      const error = new Error("Policy type slug is Missing.");
      (error as any).statusCode = 400;
      throw error;
    } else {
      policyType = await policiesRepository.getPolicyTypeBySlugRepository(slug);
      if (!policyType) {
        const error = new Error("Policy type not found");
        (error as any).statusCode = 404;
        throw error;
      }
    }

    try {
      const updatedPolicyType = await policiesRepository.updatePolicyTypeRepository(policyType.slug, body);
      return updatedPolicyType;
    } catch (error) {
      console.error("Error updating policy type:", error);
      throw error;
    }
  };

  deletePolicyType = async (slug: string) => {
    let policyType;

    if (!slug) {
      const error = new Error("Policy type is Missing.");
      (error as any).statusCode = 400;
      throw error;
    } else {
      policyType = await policiesRepository.getPolicyTypeBySlugRepository(slug);
      if (!policyType) {
        const error = new Error("Policy type not found");
        (error as any).statusCode = 404;
        throw error;
      }
    }

    try {
      const policyExistWithCurrentType = await policiesRepository.getPolicyByPolicyTypeIdRepository(policyType.id);
      console.log("🚀 ~ policies.service.ts:108 ~ policyExistWithCurrentType:", policyExistWithCurrentType);
      if (policyExistWithCurrentType) {
        const error = new Error("Cannot delete policy type. Policies exist with this type.");
        (error as any).statusCode = 400;
        throw error;
      } else {
        return await policiesRepository.deletePolicyTypeRepository(slug);
      }
    } catch (error) {
      console.error("Error deleting policy type:", error);
      throw error;
    }
  };

  getAllPolicyTableView = async (payload: { page?: number; limit?: number; order?: "asc" | "desc" }) => {
    try {
      return await pagination(payload, async (limit: number, offset: number) => {
        const [policies, totalDoc] = await Promise.all([
          policiesRepository.getAllPolicyRepository({
            limit,
            offset,
            order: payload.order,
          }),
          policiesRepository.getAllPoliciesCount(),
        ]);

        if (!policies || policies.length === 0) {
          return { doc: [], totalDoc };
        }
        const doc = await Promise.all(
          policies.map(async (policy) => {
            // policyType should be fetched by the policy's `policyTypeId`, not the policy's own id
            const policyType = await policiesRepository.getPolicyTypeByIdRepository(policy.policyTypeId);
            return {
              id: policy.id,
              title: policy.title,
              description: policy.description,
              policyTypeId: policy.policyTypeId,

              policyType: policyType?.title ?? null,
              policyTypeSlug: policyType?.slug ?? null,

              helpfulCount: policy.helpfulCount,
              notHelpfulCount: policy.notHelpfulCount,
              createdAt: policy.createdAt,
              updatedAt: policy.updatedAt,
            };
          })
        );

        return { doc, totalDoc };
      });
    } catch (error) {
      console.error("Error getting policy table view:", error);
      throw error;
    }
  };

  getAllPolicyTypes = async () => {
    try {
      const allPolicyTypes: PolicyTypeI[] | [] = await policiesRepository.getAllPolicyTypesRepository();
      return allPolicyTypes;
    } catch (error) {
      console.error("Error getting policy types:", error);
      throw error;
    }
  };

  getPolicyTypesWithPagination = async (payload: { page: number; limit: number }): Promise<any> => {
    console.log("🚀 ~ policies.service.ts:207 ~ payload:", payload);
    const { page, limit } = payload;
    const policyTypes = await policiesRepository.getPolicyTypesWithPagination({ limit, page });
    return policyTypes;
  };

  getAllPoliciesCount = async () => {
    try {
      return await policiesRepository.getAllPoliciesCount();
    } catch (e) {
      console.error(e);
      const error = new Error("Failed to fetch policies count");
      (error as any).statusCode = 500;
      throw error;
    }
  };

  createPolicy = async (payload: CreatePolicyRequestDTO): Promise<any> => {
    console.log("🚀 ~ policies.service.ts:196 ~ payload:", payload);
    const { title, description, policyTypeId } = payload;

    if (!title || !policyTypeId || !description) {
      const missingFields: string[] = [];
      if (!title) missingFields.push("title");
      if (!policyTypeId) missingFields.push("policyTypeId");
      if (!description) missingFields.push("description");

      const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
      (error as any).statusCode = 400;
      throw error;
    }

    try {
      const existingPolicy = await policiesRepository.isPolicyExist(title);
      if (existingPolicy) {
        const error = new Error(`Policy with title "${title}" already exists`);
        (error as any).statusCode = 409; // Conflict
        throw error;
      }

      const policyPayload: CreatePolicyRequestDTO = {
        title,
        description,
        policyTypeId,
      };

      const policy = await policiesRepository.createPolicyRepository(policyPayload);

      return policy;
    } catch (error) {
      console.error("Error creating policy:", error);
      throw error;
    }
  };

  createPolicyType = async (payload: CreatePolicyTypeRequestDTO): Promise<any> => {
    console.log("🚀 ~ policies.service.ts:236 ~ payload:", payload);
    const { title } = payload;

    if (!title) {
      const missingFields: string[] = [];
      if (!title) missingFields.push("title");
      const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
      (error as any).statusCode = 400;
      throw error;
    }

    const slug = slugGenerate(title);

    try {
      const policyType = await policiesRepository.createPolicyTypeRepository({ title, slug });
      return policyType;
    } catch (error: any) {
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

  getPolicyById = async (slug: string) => {
    try {
      const policyType = await policiesRepository.getPolicyTypeBySlugRepository(slug);
      if (policyType) {
        try {
          const { id } = policyType;
          const policy = await policiesRepository.getPolicyByPolicyTypeIdRepository(id);
          return policy;
        } catch (error) {
          console.error("Error finding policy:", error);
          throw error;
        }
      } else {
        throw new NotFoundError(`No policy found for policyId ${slug}`);
      }
    } catch (error) {
      console.error("Error finding policy:", error);
      throw error;
    }
  };

  updatePolicy = async (slug: string, body: Partial<PolicyRequestDTO>) => {
    console.log("🚀 ~ policies.service.ts:302 ~ body:", body);
    try {
      const missingFields: string[] = [];
      if (!body.title) missingFields.push("title");
      if (!body.description) missingFields.push("description");
      if (!body.policyTypeId) missingFields.push("policy Type Id");
      // if (!body.policyTypeTitle) missingFields.push("policy Type Title");

      if (missingFields.length > 0) {
        const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
        (error as any).statusCode = 400;
        throw error;
      }

      const isPolicyTypeExist = await policiesRepository.getPolicyTypeByIdRepository(body.policyTypeId!);
      if (!isPolicyTypeExist) {
        const error = new Error("Policy type not found");
        (error as any).statusCode = 404;
        throw error;
      }

      const isPolicyExist = await policiesRepository.getPolicyByIdRepository(body.id!);
      if (!isPolicyExist) {
        const error = new Error("Policy not found");
        (error as any).statusCode = 404;
        throw error;
      }

      const update = await policiesRepository.updatePolicyRepository(body.id!, body);

      return update;
    } catch (error) {
      console.error("Error updating policy:", error);
      throw error;
    }
  };

  deletePolicy = async (paramId: string) => {
    try {
      const id = parseInt(paramId);

      if (!id) {
        const error = new Error("Missing required field: id");
        (error as any).statusCode = 400;
        throw error;
      }

      const policy = await policiesRepository.getPolicyByIdRepository(id);
      if (!policy) {
        const error = new Error("Policy not found");
        (error as any).statusCode = 404;
        throw error;
      }

      return await policiesRepository.deletePolicyRepository(id);
    } catch (error: any) {
      console.error("Error deleting policy:", error);
      throw error;
    }
  };

  async getPolicesWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;
    const policyTypes = await policiesRepository.getPolicesWithPagination({ limit, offset }, tx);
    return policyTypes;
  }

  addHelpfulCount = async (id: number): Promise<any> => {
    try {
      if (!id) {
        const error = new Error("Missing required field: id");
        (error as any).statusCode = 400;
        throw error;
      }

      const policy = await policiesRepository.getPolicyByIdRepository(id);
      if (!policy) {
        const error = new Error(`Policy not found for id ${id}`);
        (error as any).statusCode = 404;
        throw error;
      }

      const { id: policyId, title, description, policyTypeId, helpfulCount: helpfulCounter, notHelpfulCount, createdAt, updatedAt }: PoliciesI = policy;
      const payload = { id: policyId, title, description, policyTypeId, helpfulCount: helpfulCounter, notHelpfulCount, createdAt, updatedAt };

      if (payload?.helpfulCount == null) {
        const error = new Error("Missing required field: helpfulCount");
        (error as any).statusCode = 400;
        throw error;
      }
      payload.helpfulCount = payload.helpfulCount + 1;

      const { helpfulCount } = payload;

      const updated = await policiesRepository.addHelpfulCount(id, helpfulCount);

      return responseHandler(200, "Helpful count updated successfully", updated);
    } catch (error: any) {
      console.error("Error updating helpful count:", error);
      throw error;
    }
  };

  addUnhelpfulCount = async (id: number): Promise<any> => {
    try {
      if (!id) {
        const error = new Error("Missing required field: id");
        (error as any).statusCode = 400;
        throw error;
      }

      const policy = await policiesRepository.getPolicyByIdRepository(id);
      if (!policy) {
        const error = new Error(`Policy not found for id ${id}`);
        (error as any).statusCode = 404;
        throw error;
      }

      const { id: policyId, title, description, policyTypeId, helpfulCount, notHelpfulCount: unhelpfulCounter, createdAt, updatedAt }: PoliciesI = policy;

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

      if (payload?.notHelpfulCount == null) {
        const error = new Error("Missing required field: notHelpfulCount");
        (error as any).statusCode = 400;
        throw error;
      }

      payload.notHelpfulCount = payload.notHelpfulCount + 1;

      const { notHelpfulCount } = payload;

      const updated = await policiesRepository.addUnhelpfulCount(id, notHelpfulCount);

      return responseHandler(200, "Unhelpful count updated successfully", updated);
    } catch (error: any) {
      console.error("Error updating unhelpful count:", error);
      throw error;
    }
  };
})();
