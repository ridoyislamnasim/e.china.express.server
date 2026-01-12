import { Router } from "express";
import servicesController from "../../modules/services/services.controller";

const servicesRoute = Router();  


  servicesRoute
  .route("/helpful/counter/:slug")
  .patch(servicesController.addHelpfulCount);



servicesRoute
  .route("/type")
  .post(servicesController.createServiceType)
  .get(servicesController.getAllServiceTypes);

servicesRoute
  .route("/type/pagination")
  .get(servicesController.getServiceTypesWithPagination);

servicesRoute
  .route("/type/:slug")
  .patch(servicesController.updateServiceType)
  .delete(servicesController.deleteServiceType);



// servicesRoute
//   .route("/table-view")
//   .get(servicesController.getAllServiceTableView);

// servicesRoute
//   .route("/get-single-policy/:id")
//   .get(servicesController.getSingleServiceById);




// servicesRoute
//   .route("/add-policy-unhelpful")
//   .patch(servicesController.addUnhelpfulCount);



servicesRoute
  .route("/")
  .post(servicesController.createService)
  .get(servicesController.getAllServices)

servicesRoute
  .route("/pagination")
  .get(servicesController.getServicesWithPagination);

servicesRoute
  .route("/:slug")
  .get(servicesController.getServiceBySlug)
  .patch(servicesController.updateService)
  .delete(servicesController.deleteService);


  
export default servicesRoute;
