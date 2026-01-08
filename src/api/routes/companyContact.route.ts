import { Router } from "express";
import contactUsController from "../../modules/companyContact/companyContact.controller";

const contactUsRoute = Router();

contactUsRoute
  .route("/create-company-contacts")
  .get(contactUsController.getCompanyContact)
  .put(contactUsController.createCompanyContact);


contactUsRoute
  .route("/contact-us-request")
  .post(contactUsController.createContactUsRequest)
  

contactUsRoute
  .route("/get-all-contact-requests")
  .get(contactUsController.getAllContactRequests)


contactUsRoute
  .route("/get-contact-request/:id")
  .get(contactUsController.getSingleContactRequestById)
  .put(contactUsController.markContactAsChecked)
  .delete(contactUsController.deleteSingleContactRequest)


  export default contactUsRoute


  