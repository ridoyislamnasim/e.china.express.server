export default new class GuideRespository {
    

    getGuideData() {
        // Database logic to get guide data
        return { message: "Guide data retrieved from repository" };
    }


    getGuideById(id: string) {
        // Database logic to get guide data by id
        return { message: `Guide data for id ${id} retrieved from repository` }; 
    }




    createGuideData(data: any) {
        // Database logic to create guide data
        return { message: "Guide data created in repository", data }; 
    }




    updateGuideData(id: string, data: any) {
        // Database logic to update guide data
        return { message: `Guide data with id ${id} updated in repository`, data }; 
    }


}