import { CreatePolicyRequestDTO, PolicyRequestDTO } from "../../types/policy";

export default new class PoliciesRepository {
    
    getAllPolicyTitlesRepository = async () => {


        return {message :"some policy data"};
    };

    getPolicyByIdRepository = async (slug: string) => {
        return { slug, name: "Sample Policy" };
    }

    createPolicyRepository = async (body:CreatePolicyRequestDTO) => {
        return { message: "Policy created" };
    }


    updatePolicyRepository = async (slug:string,body:Partial<PolicyRequestDTO>) => {
        return { message: "Policy updated" };
    }


    deletePolicyRepository = async (slug:string) => {
        return { message: "Policy deleted" };
    }

    
};
