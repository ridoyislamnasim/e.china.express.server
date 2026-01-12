import { CreateServiceRequestDTO, CreateServiceTypeRequestDTO, ServicesI, ServiceRequestDTO, ServiceTypeI } from "../../types/service";
import { NotFoundError } from "../../utils/errors";
import { pagination } from "../../utils/pagination";
import { responseHandler } from "../../utils/responseHandler";
import { slugGenerate } from "../../utils/slugGenerate";
import servicesRepository from "./services.repository";

export default new (class ServicesService {
  // ------------------------------------------------------------
  // ------------------- create service type -------------------
  // ------------------------------------------------------------
  createServiceType = async (payload: CreateServiceTypeRequestDTO): Promise<any> => {
    console.log("🚀 ~ services.service.ts:236 ~ payload:", payload);
    const { title } = payload;

    if (!title) {
      const missingFields: string[] = [];
      if (!title) missingFields.push("title");
      const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
      (error as any).statusCode = 400;
      throw error;
    }

    const slug = slugGenerate(title);

    try {
      const serviceType = await servicesRepository.createServiceTypeRepository({ title, slug });
      return serviceType;
    } catch (error: any) {
      console.error("Error creating service type:", error);
      throw error;
    }
  };

  getAllServiceTypes = async () => {
    try {
      const allServiceTypes: ServiceTypeI[] | [] = await servicesRepository.getAllServiceTypes();
      return allServiceTypes;
    } catch (error) {
      console.error("Error getting service types:", error);
      throw error;
    }
  };



  getServiceTypesWithPagination = async (payload: { page: number; limit: number }): Promise<any> => {
    console.log("🚀 ~ services.service.ts:207 ~ payload:", payload);
    const { page, limit } = payload;
    const serviceTypes = await servicesRepository.getServiceTypesWithPagination({ limit, page });
    return serviceTypes;
  };


  updateServiceType = async (slug: string, body: { title: string; id: number }) => {
    let serviceType;
    if (!slug) {
      const error = new Error("Service type slug is Missing.");
      (error as any).statusCode = 400;
      throw error;
    } else {
      serviceType = await servicesRepository.getServiceTypeBySlug(slug);
      if (!serviceType) {
        const error = new Error("Service type not found");
        (error as any).statusCode = 404;
        throw error;
      }
    }

    try {
      const updatedServiceType = await servicesRepository.updateServiceTypeRepository(serviceType.slug, body);
      return updatedServiceType;
    } catch (error) {
      console.error("Error updating service type:", error);
      throw error;
    }
  };

  deleteServiceType = async (slug: string) => {
    let serviceType;

    if (!slug) {
      const error = new Error("Service type is Missing.");
      (error as any).statusCode = 400;
      throw error;
    } else {
      serviceType = await servicesRepository.getServiceTypeBySlug(slug);
      if (!serviceType) {
        const error = new Error("Service type not found");
        (error as any).statusCode = 404;
        throw error;
      }
    }

    try {
      const serviceExistWithCurrentType = await servicesRepository.getServiceByServiceTypeIdRepository(serviceType.id);
      console.log("🚀 ~ services.service.ts:108 ~ serviceExistWithCurrentType:", serviceExistWithCurrentType);
      if (serviceExistWithCurrentType) {
        const error = new Error("Cannot delete service type. Services exist with this type.");
        (error as any).statusCode = 400;
        throw error;
      } else {
        return await servicesRepository.deleteServiceTypeRepository(slug);
      }
    } catch (error) {
      console.error("Error deleting service type:", error);
      throw error;
    }
  };

  // ------------------------------------------------------------
  // ------------------- create service type -------------------
  // ------------------------------------------------------------


  createService = async (payload: CreateServiceRequestDTO): Promise<any> => {
    console.log("🚀 ~ services.service.ts:196 ~ payload:", payload);
    const { title, description, serviceTypeId } = payload;

    if (!title || !serviceTypeId || !description) {
      const missingFields: string[] = [];
      if (!title) missingFields.push("title");
      if (!serviceTypeId) missingFields.push("serviceTypeId");
      if (!description) missingFields.push("description");

      const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
      (error as any).statusCode = 400;
      throw error;
    }

    try {
      const existingService = await servicesRepository.isServiceExist(title);
      if (existingService) {
        const error = new Error(`Service with title "${title}" already exists`);
        (error as any).statusCode = 409; // Conflict
        throw error;
      }

      const servicePayload: CreateServiceRequestDTO = {
        title,
        slug: slugGenerate(title),
        description,
        serviceTypeId,
      };

      const service = await servicesRepository.createService(servicePayload);

      return service;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  };

  getAllServices = async () => {
    try {
      const allServices = await servicesRepository.getAllServices();
      return allServices;
    } catch (error) {
      console.error("Error getting service titles:", error);
      throw error;
    }
  };


  getServiceBySlug = async (slug: string) => {
    if (!slug) {
      const error = new Error("Service slug is missing.");
      (error as any).statusCode = 400;
      throw error;
    }
    const service = await servicesRepository.isServiceExistBySlug(slug);
    if (!service) {
      const error = new Error(`No service found for slug ${slug}`);
      (error as any).statusCode = 404;
      throw error;
    }
    return service;
  };


  updateService = async (slug: string, payload: Partial<ServiceRequestDTO>) => {
    console.log("🚀 ~ services.service.ts:302 ~ payload:", payload);
    try {
      const missingFields: string[] = [];
      if (!payload.title) missingFields.push("title");
      if (!payload.description) missingFields.push("description");
      if (!payload.serviceTypeId) missingFields.push("service Type Id");
      // if (!payload.serviceTypeTitle) missingFields.push("service Type Title");
      payload.slug = slugGenerate(payload.title!);
      if (missingFields.length > 0) {
        const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
        (error as any).statusCode = 400;
        throw error;
      }

      const isServiceTypeExist = await servicesRepository.isServiceTypeExitById(payload.serviceTypeId!);
      if (!isServiceTypeExist) {
        const error = new Error("Service type not found");
        (error as any).statusCode = 404;
        throw error;
      }

      const isServiceExist = await servicesRepository.isServiceExitBySlug(payload.slug);
      if (isServiceExist) {
        const error = new Error("Service not found");
        (error as any).statusCode = 404;
        throw error;
      }

      const update = await servicesRepository.updateServiceRepository(slug, payload);

      return update;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  };


  async getServicesWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const serviceTypes = await servicesRepository.getServicesWithPagination(payload, tx);
    return serviceTypes;
  }

  deleteService = async (paramSlug: string) => {
    const slug = paramSlug;
    if (!slug) {
      const error = new Error("Missing required field: slug");
      (error as any).statusCode = 400;
      throw error;
    }
    const service = await servicesRepository.isServiceExitBySlug(slug);
    if (!service) {
      const error = new Error("Service not found");
      (error as any).statusCode = 404;
      throw error;
    }
    return await servicesRepository.deleteService(slug);

  };


  // ------------------------------------------------------------
  // ------------------- helpful count -------------------
  // ------------------------------------------------------------



  addHelpfulCount = async (slug: string, payload: { increase: boolean }): Promise<any> => {
    try {
      if (!slug) {
        const error = new Error("Missing required field: slug");
        (error as any).statusCode = 400;
        throw error;
      }

      const service = await servicesRepository.isServiceExitBySlug(slug);
      if (!service) {
        const error = new Error(`Service not found for slug ${slug}`);
        (error as any).statusCode = 404;
        throw error;
      }

      const updated = await servicesRepository.addHelpfulCount(slug, payload);

      return responseHandler(200, "Helpful count updated successfully", updated);
    } catch (error: any) {
      console.error("Error updating helpful count:", error);
      throw error;
    }
  };


  // getSingleServiceById = async (id: string) => {
  //   try {
  //     if (!id) {
  //       const error = new Error("Service ID is missing.");
  //       (error as any).statusCode = 400;
  //       throw error;
  //     }
  //     const service = await servicesRepository.getSingleServiceByIdRepository(id);
  //     if (!service) {
  //       const error = new Error(`No service found for ID ${id}`);
  //       (error as any).statusCode = 404;
  //       throw error;
  //     }
  //     return service;
  //   } catch (error) {
  //     console.error("Error getting service by ID:", error);
  //     throw error;
  //   }
  // };

  // getAllServiceTableView = async (payload: { page?: number; limit?: number; order?: "asc" | "desc" }) => {
  //   try {
  //     return await pagination(payload, async (limit: number, offset: number) => {
  //       const [services, totalDoc] = await Promise.all([
  //         servicesRepository.getAllServiceRepository({
  //           limit,
  //           offset,
  //           order: payload.order,
  //         }),
  //         servicesRepository.getAllServicesCount(),
  //       ]);

  //       if (!services || services.length === 0) {
  //         return { doc: [], totalDoc };
  //       }
  //       const doc = await Promise.all(
  //         services.map(async (service) => {
  //           // serviceType should be fetched by the service's `serviceTypeId`, not the service's own id
  //           const serviceType = await servicesRepository.isServiceTypeExitById(service.serviceTypeId);
  //           return {
  //             id: service.id,
  //             title: service.title,
  //             description: service.description,
  //             serviceTypeId: service.serviceTypeId,

  //             serviceType: serviceType?.title ?? null,
  //             serviceTypeSlug: serviceType?.slug ?? null,

  //             helpfulCount: service.helpfulCount,
  //             notHelpfulCount: service.notHelpfulCount,
  //             createdAt: service.createdAt,
  //             updatedAt: service.updatedAt,
  //           };
  //         })
  //       );

  //       return { doc, totalDoc };
  //     });
  //   } catch (error) {
  //     console.error("Error getting service table view:", error);
  //     throw error;
  //   }
  // };


  // getAllServicesCount = async () => {
  //   try {
  //     return await servicesRepository.getAllServicesCount();
  //   } catch (e) {
  //     console.error(e);
  //     const error = new Error("Failed to fetch services count");
  //     (error as any).statusCode = 500;
  //     throw error;
  //   }
  // };

  // // createServiceType = async ( payload: CreateServiceTypeRequestDTO ): Promise<any> => {
  // //   const { title } = payload;
  // //   const slug = slugGenerate(title);

  // //   if (!title || !slug) {
  // //     const missingFields: string[] = [];
  // //     if (!title) missingFields.push("title");
  // //     if (!slug) missingFields.push("slug");

  // //     const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
  // //     (error as any).statusCode = 400;
  // //     throw error;
  // //   }

  // //   try {
  // //     const serviceType = await servicesRepository.createServiceTypeRepository({ title, slug});
  // //     return serviceType;
  // //   } catch (error: any) {
  // //     console.error("Error creating service type:", error);

  // //   }
  // // };

  // addUnhelpfulCount = async (id: number): Promise<any> => {
  //   try {
  //     if (!id) {
  //       const error = new Error("Missing required field: id");
  //       (error as any).statusCode = 400;
  //       throw error;
  //     }

  //     const service = await servicesRepository.isServiceExitById(id);
  //     if (!service) {
  //       const error = new Error(`Service not found for id ${id}`);
  //       (error as any).statusCode = 404;
  //       throw error;
  //     }

  //     const { id: serviceId, title, description, serviceTypeId, helpfulCount, notHelpfulCount: unhelpfulCounter, createdAt, updatedAt }: ServicesI = service;

  //     const payload = {
  //       id: serviceId,
  //       title,
  //       description,
  //       serviceTypeId,
  //       helpfulCount,
  //       notHelpfulCount: unhelpfulCounter,
  //       createdAt,
  //       updatedAt,
  //     };

  //     if (payload?.notHelpfulCount == null) {
  //       const error = new Error("Missing required field: notHelpfulCount");
  //       (error as any).statusCode = 400;
  //       throw error;
  //     }

  //     payload.notHelpfulCount = payload.notHelpfulCount + 1;

  //     const { notHelpfulCount } = payload;

  //     const updated = await servicesRepository.addUnhelpfulCount(id, notHelpfulCount);

  //     return responseHandler(200, "Unhelpful count updated successfully", updated);
  //   } catch (error: any) {
  //     console.error("Error updating unhelpful count:", error);
  //     throw error;
  //   }
  // };
})();
