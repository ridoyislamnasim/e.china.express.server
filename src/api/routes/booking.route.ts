import { Router } from "express";
import controller from "../../modules/booking/booking.controller";
import { upload } from "../../middleware/upload/upload";
import jwtAuth from "../../middleware/auth/jwtAuth";

const BookingRouter = Router();
// BookingRouter.use(jwtAuth());
// customer add supplier information for booking
BookingRouter.route("/supplier")
  .post( jwtAuth(), controller.createSupplierInformation) // not use now
  .get(jwtAuth(), controller.getAllSupplierInformation);

  // customer add Local Delivery Information for booking
BookingRouter.route("/local-delivery")
  .post( jwtAuth(), controller.createLocalDeliveryInformation) // not use now
  .get(jwtAuth(), controller.getAllLocalDeliveryInformation);

BookingRouter.route("/package").post( jwtAuth(), controller.createBookingPackage)
BookingRouter.patch("/customer/tracking-number", jwtAuth(), controller.updateBookingTrackingNumberByCustomer);

// upload booking invoice, product and packing list by customer
BookingRouter.patch("/invoice",upload, jwtAuth(), controller.updateBookingInvoiceByCustomer);
BookingRouter.patch("/product",upload, jwtAuth(), controller.updateBookingProductByCustomer);
BookingRouter.patch("/packing-list",upload, jwtAuth(), controller.updateBookingPackingListByCustomer);


BookingRouter.get("/warehouse/find-booking", jwtAuth(), controller.findBookingForWarehouseByTrackingNumberAndOrderNumber);
BookingRouter.post("/warehouse/inventory-receipt",upload, jwtAuth(), controller.createInventoryReceiptByWarehouse);
BookingRouter.post("/warehouse/inventory-stored",upload, jwtAuth(), controller.createInventoryStoredByWarehouse);
// admin Update Booking Status
BookingRouter.patch("/admin/status/:id", jwtAuth(), controller.updateBookingApprovedRejectByAdmin);

BookingRouter.get("/pagination", jwtAuth(), controller.getAllBookingByFilterWithPagination);
BookingRouter.get("/warehouses-management/pagination", jwtAuth(), controller.getAllBookingForWarehouseByFilterWithPagination);
BookingRouter.get("/admin/pagination", jwtAuth(), controller.getAllBookingForAdminByFilterWithPagination);
// discount calculation for admin shipping decision shipping, packing and brnding
BookingRouter.post("/admin/discount-calculation/:id", jwtAuth(), controller.calculateDiscountForAdminShippingDecision);


BookingRouter.route("/:id")
  .get(jwtAuth(), controller.getSingleBooking)
  .put(jwtAuth(), controller.updateBooking)
  .delete(jwtAuth(), controller.deleteBooking);

export default BookingRouter;
