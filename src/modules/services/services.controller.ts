import { NextFunction, Request, Response } from "express";
import servicesService from "./services.service";
import { responseHandler } from "../../utils/responseHandler";
import catchError from "../../middleware/errors/catchError";
import withTransaction from "../../middleware/transactions/withTransaction";
import { CreateServiceTypeRequestDTO } from "../../types/service";

export default new (class ServicesController {

  // ------------------------------------------------------------
  // ------------------- create service type -------------------
  // ------------------------------------------------------------
  createServiceType = catchError(async (req: Request, res: Response) => {
    const payload = {
      title: req.body.title,
    }
    const newServiceType = await servicesService.createServiceType(payload as CreateServiceTypeRequestDTO);
    const resDoc = responseHandler(201, "New service type created successfully.", newServiceType);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllServiceTypes = catchError(async (req: Request, res: Response) => {
    const allServiceTypes = await servicesService.getAllServiceTypes();
    const resDoc = responseHandler(201, "All service types fetched successfully.", allServiceTypes);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getServiceTypesWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    console.log("🚀 ~ services.controller.ts:114 ~ limit:", limit);

    const data = await servicesService.getServiceTypesWithPagination({ page, limit });

    const resDoc = responseHandler(200, "Service types retrieved successfully with pagination.", data);
    res.status(resDoc.statusCode).json(resDoc);
  });


  updateServiceType = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const { title, id } = req.body;
    const payload = { title, id };
    const updated = await servicesService.updateServiceType(slug, payload);
    const resDoc = responseHandler(200, "Service Type updated successfully.", updated);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteServiceType = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const result = await servicesService.deleteServiceType(slug);

    const resDoc = responseHandler(200, "Service fetched successfully.", result);
    res.status(resDoc.statusCode).json(resDoc);
  });




  // ------------------------------------------------------------
  // ------------------- create service type -------------------
  // ------------------------------------------------------------

  createService = catchError(async (req: Request, res: Response) => {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      serviceTypeId: req.body.serviceTypeId
    }
    const newService = await servicesService.createService(payload);

    const resDoc = responseHandler(201, "New service created successfully.", newService);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getAllServices = catchError(async (req: Request, res: Response) => {
    const getAllServices = await servicesService.getAllServices();
    const resDoc = responseHandler(201, "All services fetched successfully.", getAllServices);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getServiceBySlug = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const service = await servicesService.getServiceBySlug(slug);

    const resDoc = responseHandler(200, "Service fetched successfully.", service);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateService = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const { title, description, serviceTypeId, serviceTypeTitle, id } = req.body;
    const payload = {
      title,
      description,
      serviceTypeId,
      serviceTypeTitle
    };
    const updated = await servicesService.updateService(slug, payload);

    const resDoc = responseHandler(200, "Service updated successfully.", updated);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getServicesWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const payload = { page, limit };

    const data = await servicesService.getServicesWithPagination(payload, tx);

    const resDoc = responseHandler(200, "Services retrieved successfully with pagination.", data);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteService = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    await servicesService.deleteService(slug);

    const resDoc = responseHandler(200, `Service with slug ${slug} deleted successfully.`, null);
    res.status(resDoc.statusCode).json(resDoc);
  });



  // ------------------------------------------------------------
  // ------------------- helpful count -------------------
  // ------------------------------------------------------------

  addHelpfulCount = catchError(async (req: Request, res: Response) => {
    console.log("🚀 ~ services.controller.ts:202 ~ req:", req.params.slug, req.query.increase);
    const slug = req.params.slug;
    const payload = {
      increase: req.query.increase === 'true' ? true : false
    }

    const result = await servicesService.addHelpfulCount(slug, payload);

    const resDoc = responseHandler(200, "Service Counted as helpful.", result);
    res.status(resDoc.statusCode).json(resDoc);
  });




  // getAllServiceTableView = catchError(async (req: Request, res: Response) => {
  //   const payload = {
  //     page: Number(req.query.page) || 1,
  //     limit: Number(req.query.limit) || 10,
  //     order: (req.query.order as "asc" | "desc") || "desc",
  //   };

  //   const services = await servicesService.getAllServiceTableView(payload);

  //   const resDoc = responseHandler(200, "All services fetched successfully.", services);

  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // getSingleServiceById = catchError(async (req: Request, res: Response) => {
  //   const id = req.params.id;
  //   const service = await servicesService.getSingleServiceById(id);
  //   const resDoc = responseHandler(200, "Service fetched successfully.", service);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });



  // addUnhelpfulCount = catchError(async (req: Request, res: Response) => {
  //   const { id } = req.body;
  //   // res.send(id)
  //   const result = await servicesService.addUnhelpfulCount(id);

  //   const resDoc = responseHandler(200, "Service Counted as unhelpful.", result);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });
})();
