export default new class GuideService {



    getGuideData() {
    // Logic to get guide data
    return { message: "Guide data retrieved successfully" };    
    }








    getGuideById(id: string) {
    // Logic to get guide data by id
    return { message: `Guide data for id ${id} retrieved successfully` };    
    }











    createGuideData(data: any) {
    // Logic to create guide data
    return { message: "Guide data created successfully", data };    
    }









    updateGuideData(id: string, data: any) {
    // Logic to update guide data
    return { message: `Guide data with id ${id} updated successfully`, data };    
    }











    deleteGuideData(id: string) {
    // Logic to delete guide data
    return { message: `Guide data with id ${id} deleted successfully` };    
    }








}