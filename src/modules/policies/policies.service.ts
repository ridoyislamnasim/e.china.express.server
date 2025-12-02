import { CreatePolicyRequestDTO, PolicyRequestDTO } from "../../types/policy"
import policiesRepository from "./policies.repository"

export default new class  PoliciesService {
    
    
    
    getAllPolicyTitles = async () => {
        return await policiesRepository.getAllPolicyTitlesRepository()
    }



    getPolicyById = async (slug: string) => {
        return await policiesRepository.getPolicyByIdRepository(slug)
    }

    
     createPolicy = async (payload: CreatePolicyRequestDTO): Promise<any> => {
        const { title, description, policyTypeId } = payload;

        // ✅ Validate required fields
        if (!title || !policyTypeId  || !description) {
            const missingFields: string[] = [];
            if (!title) missingFields.push("title");
            if (!policyTypeId) missingFields.push("policyTypeId");
            if (!description) missingFields.push("description");

            const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
            (error as any).statusCode = 400;
            throw error;
        }

        try {
            // ✅ Check if policy already exists
            const existingPolicy = await policiesRepository.isPolicyExist(title);
            if (existingPolicy) {
                const error = new Error(`Policy with title "${title}" already exists`);
                (error as any).statusCode = 409; // Conflict
                throw error;
            }

            // ✅ Build payload
            const policyPayload: CreatePolicyRequestDTO = {
                title,
                description,
                policyTypeId
            };

            // ✅ Create policy
            const policy = await policiesRepository.createPolicyRepository(policyPayload);

            // (Optional) If you want to attach related entities like ports in country service,
            // you could add logic here for related records.

            return policy;
        } catch (error) {
            console.error("Error creating policy:", error);
            throw error;
        }
    }


    updatePolicy = async (slug:string,body:Partial<PolicyRequestDTO>) => {
        return await policiesRepository.updatePolicyRepository(slug,body)
    }  

    deletePolicy = async (slug:string) => {
        return await policiesRepository.deletePolicyRepository(slug)
    }

}