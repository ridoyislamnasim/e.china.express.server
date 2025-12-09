import { CreatePolicyRequestDTO, CreatePolicyTypeRequestDTO, PoliciesI, PolicyRequestDTO } from "../../types/policy";
import { NotFoundError } from "../../utils/errors";
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
    } catch (error) {
      console.error("Error getting policy titles:", error);
      throw error;
    }
  };

  createPolicy = async (payload: CreatePolicyRequestDTO): Promise<any> => {
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
    try {
      const missingFields: string[] = [];
      if (!body.title) missingFields.push("title");
      if (!body.description) missingFields.push("description");

      if (missingFields.length > 0) {
        const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
        (error as any).statusCode = 400;
        throw error;
      }

      const policyType = await policiesRepository.getPolicyTypeBySlugRepository(slug);
      if (!policyType) {
        const error = new Error("Policy type not found");
        (error as any).statusCode = 404;
        throw error;
      }

      const policy = await policiesRepository.getPolicyByPolicyTypeIdRepository(policyType.id);
      if (!policy) {
        const error = new Error("Policy not found for this policy type");
        (error as any).statusCode = 404;
        throw error;
      }

      const updatedPolicy = await policiesRepository.updatePolicyRepository(policy.id, body);

      return {
        message: "Policy updated successfully",
        data: updatedPolicy,
      };
    } catch (error: any) {
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

      const policy = await policiesRepository.getPolicyByPolicyTypeIdRepository(id);
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
    const countries = await policiesRepository.getPolicesWithPagination({ limit, offset }, tx);
    return countries;
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
      payload.helpfulCount = payload.helpfulCount+1;

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

    const { 
      id: policyId, 
      title, 
      description, 
      policyTypeId, 
      helpfulCount, 
      notHelpfulCount: unhelpfulCounter, 
      createdAt, 
      updatedAt 
    }: PoliciesI = policy;

    const payload = { 
      id: policyId, 
      title, 
      description, 
      policyTypeId, 
      helpfulCount, 
      notHelpfulCount: unhelpfulCounter, 
      createdAt, 
      updatedAt 
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
