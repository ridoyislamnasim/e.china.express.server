// import { Router } from "express";
// import controller from "../../modules/newsletter/newsletter.controller";
// // import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

// const NewsletterRoute = Router();
// // NewsletterRoute.use(jwtAuth());

// NewsletterRoute.route("/")
//   .post(upload.any(), controller.createNewsletter)
//   .get(controller.getAllNewsletter);

// NewsletterRoute.get("/pagination", controller.getNewsletterWithPagination);

// NewsletterRoute.route(":id")
//   .get(controller.getSingleNewsletter)
//   .put(upload.any(), controller.updateNewsletter)
//   .delete(controller.deleteNewsletter);

// export default NewsletterRoute;
