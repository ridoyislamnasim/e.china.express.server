import { Router } from "express";
import sizeMeasurementController from "../../modules/size-measurement/size-measurement.controller";

const sizeMeasurementRoute = Router();


sizeMeasurementRoute
  .route("/size-measurement-types")
  .get(sizeMeasurementController.getAllSizeMeasurementTypes)



  
sizeMeasurementRoute
  .route("/create-size-measurement-type")
  .post(sizeMeasurementController.createSizeMeasurementType);



sizeMeasurementRoute
  .route("/update-size-measurement-type/:slug")
  .patch(sizeMeasurementController.updateSizeMeasurementType)



sizeMeasurementRoute
  .route("/type-pagination")
  .get(sizeMeasurementController.getSizeMeasurementTypesWithPagination);



sizeMeasurementRoute
  .route("/size-measurement-type/:slug")
  .delete(sizeMeasurementController.deleteSizeMeasurementType);



sizeMeasurementRoute
  .route("/size-measurement-table-view")
  .get(sizeMeasurementController.getAllSizeMeasurementTableView);



sizeMeasurementRoute
  .route("/get-single-size-measurement/:id")
  .get(sizeMeasurementController.getSingleSizeMeasurementById);



sizeMeasurementRoute
  .route("/")
  .get(sizeMeasurementController.getAllSizeMeasurementTitles)
  .post(sizeMeasurementController.createSizeMeasurement);



sizeMeasurementRoute
  .route("/:slug")
  .get(sizeMeasurementController.getSizeMeasurementById)
  .patch(sizeMeasurementController.updateSizeMeasurement)




sizeMeasurementRoute
  .route("/:id")
  .delete(sizeMeasurementController.deleteSizeMeasurement);






































  



  // sizeMeasurementRoute
//   .route("/add-size-measurement-helpful")
//   .patch(sizeMeasurementController.addHelpfulCount);

// sizeMeasurementRoute
//   .route("/add-size-measurement-unhelpful")
//   .patch(sizeMeasurementController.addUnhelpfulCount);




export default sizeMeasurementRoute;
