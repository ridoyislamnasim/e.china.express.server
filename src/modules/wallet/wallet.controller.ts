import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import walletService from "./wallet.service";
import { getAuthUserId, getAuthUser } from "../../utils/auth.helper";

class WalletController {
  createWallet = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      // const userId = (req as any).user?.user_info_encrypted?.id;

      const userId = getAuthUserId(req);

      const payload = {
        name: req.body.name,
        currency: req.body.currency,
        monthlyLimit: req.body.monthlyLimit || 50000,
        category: req.body.category || "General",
      };

      const wallet = await walletService.createManualWallet(
        userId,
        payload,
        tx,
      );
      const resDoc = responseHandler(
        201,
        "Wallet created successfully. Please activate it.",
        wallet,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getWallets = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = getAuthUserId(req);

      const result = await walletService.getWalletsByUserId(userId);
      const resDoc = responseHandler(200, "Wallets retrieved", result);
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getSingleWallet = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const userId = getAuthUserId(req);

      const wallet = await walletService.getSingleWallet(id, userId);
      const resDoc = responseHandler(200, "Wallet details retrieved", wallet);
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateWalletStatus = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const { status } = req.body;
      const wallet = await walletService.updateWalletStatus(id, status);
      const resDoc = responseHandler(
        200,
        `Wallet status updated to ${status}`,
        wallet,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );
}

export default new WalletController();
