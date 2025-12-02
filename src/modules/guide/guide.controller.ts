import { Request, Response } from "express";

export default new class GuideController {
  
  
  
  
  
  
  
  
  
  
    getGuide(req:Request, res:Response) {
    res.send("Guide GET route works");
  }






  createGuide(req:Request, res:Response) {
    res.send("Guide CREATE route works");
  }







    updateGuide(req:Request, res:Response) {
    res.send("Guide UPDATE route works");
  }



  


    deleteGuide(req:Request, res:Response) {
    res.send("Guide DELETE route works");
  }




}