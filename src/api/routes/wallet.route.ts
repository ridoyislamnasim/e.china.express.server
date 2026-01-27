import { Router } from "express";
import jwtAuth from "../../middleware/auth/jwtAuth"; // Assuming you have this
import walletController from "../../modules/wallet/wallet.controller";

const WalletRoute = Router();

// Secure all wallet routes
WalletRoute.use(jwtAuth());

WalletRoute.route("/")
  .post(walletController.createWallet)
  .get(walletController.getWallets);

WalletRoute.route("/:id").get(walletController.getSingleWallet);

WalletRoute.patch("/:id/status", walletController.updateWalletStatus);
export default WalletRoute;
