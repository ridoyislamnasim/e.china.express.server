import { Router } from "express";
import * as controller from "../../modules/auth/auth.controller";
import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";

const AuthRouter = Router();
AuthRouter.post("/signup", controller.authUserSignUp)
  .post("/signin", controller.authUserSignIn)
  .post("/signout", controller.authUserSignOut)
  .post("/create", controller.createUser)
  // .get('/create', controller.getUser)
  .post('/forget-password', controller.authForgetPassword)
  .post('/forget-password/otp-verification', controller.authForgetPasswordVarification)
  .get('/', jwtAuth(), controller.getUserBy)
  .put('/', upload, jwtAuth(), controller.updateUser) // Uncomment if upload middleware is ready
AuthRouter.post("/super-admin", jwtAuth(), controller.createSuperAdminRole);

// user routes
AuthRouter.get('/users/pagination', jwtAuth(["superAdmin"]), controller.getUserWithPagination)
AuthRouter.put('/user/role', jwtAuth(["superAdmin"]), controller.updateUserRole);
AuthRouter.get('/user', jwtAuth(["superAdmin"]), controller.getAllUser)
// .get('/user/:id', controller.getSingleUser)
// .delete('/user/:id', controller.getDeleteUser);

AuthRouter.post("/super-admin", jwtAuth(), controller.createSuperAdminRole);

// user routes
// AuthRouter.get('/users/pagination', jwtAuth(), controller.getUserWithPagination)
// .put('/', upload.any(), jwtAuth('admin', 'student'), controller.updateUser) // Uncomment if upload middleware is ready
// .get('/user',jwtAuth(["superAdmin"]), controller.getAllUser)
// .get('/user/:id', controller.getSingleUser)
// .delete('/user/:id', controller.getDeleteUser);
AuthRouter.get("/users-wallets", controller.getAllUsersWithWallets);
export default AuthRouter;
