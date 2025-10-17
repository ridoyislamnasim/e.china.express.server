import { Router } from "express";
import * as controller from "../../modules/auth/auth.controller";
// import { upload } from "../../middleware/upload/upload";
import jwtAuth from "../../middleware/auth/jwtAuth";

const AuthRouter = Router();
AuthRouter
  .post('/signup', controller.authUserSignUp)
  .post('/signin', controller.authUserSignIn)
  .post('/create', controller.createUser)
  .get('/create', controller.getUser)
  .post('/forget-password', controller.authForgetPassword)
  .post('/forget-password/otp-verification', controller.authForgetPasswordVarification)
  // .get('/', jwtAuth('admin', 'student'), controller.getUserById)
  // .put('/', upload.any(), jwtAuth('admin', 'student'), controller.updateUser) // Uncomment if upload middleware is ready
  .get('/user', controller.getAllUser)
  .get('/user/:id', controller.getSingleUser)
  .delete('/user/:id', controller.getDeleteUser);

export default AuthRouter;
