import { Router } from "express";
import controller from "../../modules/carrierCompany/carrier.company.controller";
import { upload } from "../../middleware/upload/upload";

const carrierCompanyRouter = Router();

carrierCompanyRouter.route("/")
    .post(upload, controller.createCarrierCompany)
    .get(controller.getAllCarrierCompanys);

carrierCompanyRouter.get("/pagination", controller.getCarrierCompanyWithPagination);

carrierCompanyRouter.route("/:id")
    .patch(upload, controller.updateCarrierCompany)
    .get(controller.getSingleCarrierCompany)
    .delete(controller.deleteCarrierCompany);

export default carrierCompanyRouter;
