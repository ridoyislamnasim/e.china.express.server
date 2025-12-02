import prisma from "../../config/prismadatabase";
import { CreatePolicyRequestDTO, PolicyRequestDTO } from "../../types/policy";

export default new class PoliciesRepository {
    

    private prisma = prisma;


    getAllPolicyTitlesRepository = async () => {


        return {message :"some policy data"};
    };

    getPolicyByIdRepository = async (slug: string) => {
        return { slug, name: "Sample Policy" };
    }


    createPolicyRepository = async (body: CreatePolicyRequestDTO): Promise<any> => {
        return await this.prisma.policies.create({
            data: {
                title: body.title,
                description: body.description,
                policyTypeId: body.policyTypeId,
                // Prisma will automatically link the relation via policyTypeId
            }
        });
    };


    isPolicyExist = async (title:string):Promise<any> => {
        return await this.prisma.policies.findFirst({
            where:{ title:title }
        })
    }


    updatePolicyRepository = async (slug:string,body:Partial<PolicyRequestDTO>) => {
        return { message: "Policy updated" };
    }


    deletePolicyRepository = async (slug:string) => {
        return { message: "Policy deleted" };
    }

    
};
