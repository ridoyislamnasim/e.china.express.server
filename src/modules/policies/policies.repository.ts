export default new class PoliciesRepository {
    
    getAllPoliciesRepository = async () => {
        return ["some policy data"];
    };

    getPolicyByIdRepository = async (slug: string) => {
        return { slug, name: "Sample Policy" };
    }

};
