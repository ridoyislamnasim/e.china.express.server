import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import shoppingOrderService from './shopping.order.service';
import { getAuthUserId } from '../../utils/auth.helper';
import { stat } from 'fs';

class OrderController {
    createShoppingOrder = withTransaction(
        async (req: Request, res: Response, next: NextFunction, tx: any) => {
            try {
                const { addressId, products, payment } = req.body;
                const userId = getAuthUserId(req);
                const payload = {
                    userId,
                    addressId,
                    products,
                    payment,
                };
                const order = await shoppingOrderService.createShoppingOrder(payload, tx);
                const resDoc = responseHandler(201, 'Order created successfully', order);
                res.status(resDoc.statusCode).json(resDoc);
            } catch (error) {
                next(error);
            }
        }
    )

    calculateDiscountForAdminShoppingDecision = catchError(async (req: Request, res: Response, next: NextFunction) => {
        const bookingId = req.params.id as string;
        const palyload = {
            // discountTarget: "shipping" | "packaging" | "branding",
            discountTarget: req.body.discountTarget as string,
            discountType: req.body.discountType as string,
            discountValue: req.body.discountValue as string,
        };
        const BookingResult = await shoppingOrderService.calculateDiscountForAdminShoppingDecision(bookingId, palyload);
        const resDoc = responseHandler(201,
            "Calculate Discount for Admin Shopping Decision successfully",
            BookingResult,
        );
        res.status(resDoc.statusCode).json(resDoc);
    },
    );

    createPurchaseForShoppingOrderByAdmin = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
        const payloadFiles = {
            files: req.files,
        };

        const rawPurchaseProductIds = req.body.purchaseProductIds ?? req.body["purchaseProductIds[]"];
        const purchaseProductIds = (Array.isArray(rawPurchaseProductIds)
            ? rawPurchaseProductIds
            : rawPurchaseProductIds != null
                ? [rawPurchaseProductIds]
                : []
        )
            .map((id: any) => Number(id))
            .filter((id: number) => Number.isFinite(id));

        const payload = {
            purchaseProductIds,
            supplierName: req.body.supplierName,
            paymentMethod: req.body.paymentMethod.toUpperCase(),
            purchaseLink: req.body.purchaseLink,
            sourcingPrice: req.body.sourcingPrice,
            courierFee: req.body.courierFee,
            totalAmount: req.body.totalAmount,
        };
        const BookingResult = await shoppingOrderService.createPurchaseForShoppingOrderByAdmin(payload, payloadFiles, tx,);
        const resDoc = responseHandler(201, "Purchase created for shopping order successfully", BookingResult,);
        res.status(resDoc.statusCode).json(resDoc);
    },
    );

    updateShoppingOrderStatusApproveRejectByAdmin = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
        const payload = {
            adminId: req.user?.user_info_encrypted?.id
                ? Number(req.user.user_info_encrypted.id)
                : undefined,
            status: req.body.status,
            adminRemarks: req.body.adminRemarks,
        };
        const BookingResult =
            await shoppingOrderService.updateShoppingOrderStatusApproveRejectByAdmin(req.params.id as string, payload, tx,);
        const resDoc = responseHandler(201, "Booking Status Updated successfully", BookingResult,);
        res.status(resDoc.statusCode).json(resDoc);
    },
    );

    getShoppingOrderWithPagination = catchError(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = getAuthUserId(req);
                const { page, limit } = req.query;
                const payload = {
                    userId,
                    page: Number(page) || 1,
                    limit: Number(limit) || 10,
                    status: req.query.status as string,
                    order: req.query.order === "asc" ? "asc" : "desc",
                };
                console.log("Pagination payload:", req.query, payload);
                const orders = await shoppingOrderService.getShoppingOrderWithPagination(payload);
                const resDoc = responseHandler(200, 'Orders retrieved successfully', orders);
                res.status(resDoc.statusCode).json(resDoc);
            } catch (error) {
                next(error);
            }
        }
    )

    getAllShoppingOrdersWithPaginationForAdmin = catchError(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = getAuthUserId(req);
                const { page, limit, status } = req.query;
                const payload = {
                    userId,
                    page: Number(page) || 1,
                    limit: Number(limit) || 10,
                    status: status as string,
                };
                console.log("Admin pagination payload:", req.query, payload);
                const orders = await shoppingOrderService.getAllShoppingOrdersWithPaginationForAdmin(payload);
                const resDoc = responseHandler(200, 'Orders retrieved successfully', orders);
                res.status(resDoc.statusCode).json(resDoc);
            } catch (error) {
                next(error);
            }
        }
    )



    updateShoppingOrderStatusSourcingPurchasingByAdmin = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
        const bookingOrderId = req.params.id as string;
        const payload = {
            adminId: req.user?.user_info_encrypted?.id
                ? Number(req.user.user_info_encrypted.id)
                : undefined,
            status: req.body.status,
            adminRemarks: req.body.adminRemarks,
        };
        const BookingResult =
            await shoppingOrderService.updateShoppingOrderStatusSourcingPurchasingByAdmin(bookingOrderId, payload, tx,);
        const resDoc = responseHandler(201, "Booking Status Updated successfully", BookingResult,);
        res.status(resDoc.statusCode).json(resDoc);
    },
    );

    getAllShoopingOrderForAdminByFilterWithPagination = catchError(
        async (req: Request, res: Response, next: NextFunction) => {
            const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
            const payload = {
                userRef: userRef,
                bookingStatus: req.query.bookingStatus as string,
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 10,
                order: req.query.order === "asc" ? "asc" : "desc",
            };
            const BookingResult =
                await shoppingOrderService.getAllShoopingOrderForAdminByFilterWithPagination(
                    payload,
                );
            const resDoc = responseHandler(200, "Get All Bookings", BookingResult);
            res.status(resDoc.statusCode).json(resDoc);
        },
    );

}

export default new OrderController();
