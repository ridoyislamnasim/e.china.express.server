import { CreatePolicyRequestDTO, PolicyRequestDTO } from "../../types/policy"
import policiesRepository from "./policies.repository"

export default new class  PoliciesService {
    
    
    
    getAllPolicyTitles = async () => {
        return await policiesRepository.getAllPolicyTitlesRepository()
    }



    getPolicyById = async (slug: string) => {
        return await policiesRepository.getPolicyByIdRepository(slug)
    }

    
    createPolicy = async (body:CreatePolicyRequestDTO) => {
        return await policiesRepository.createPolicyRepository(body)
    }


    updatePolicy = async (slug:string,body:Partial<PolicyRequestDTO>) => {
        return await policiesRepository.updatePolicyRepository(slug,body)
    }  

    deletePolicy = async (slug:string) => {
        return await policiesRepository.deletePolicyRepository(slug)
    }

}