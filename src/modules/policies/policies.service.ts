import policiesRepository from "./policies.repository"

export default new class  PoliciesService {
    
    
    
    getAllPolicies = async () => {
        return await policiesRepository.getAllPoliciesRepository()
    }



    getPolicyById = async (slug: string) => {
        return await policiesRepository.getPolicyByIdRepository(slug)
    }

}