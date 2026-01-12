import { Console } from "console";
import prisma from "../../config/prismadatabase";
import { CreateServiceRequestDTO, ServiceRequestDTO, ServiceTypeI } from "../../types/service";
import { pagination } from "../../utils/pagination";
import { slugGenerate } from "../../utils/slugGenerate";

export default new (class ServicesRepository {
  private prisma = prisma;

  // ------------------------------------------------------------
  // ------------------- Common -------------------
  // ------------------------------------------------------------
  getServiceTypeBySlug = async (slug: string) => {
    console.log("🚀 ~ services.repository.ts:16 ~ ServicesRepository ~ getServiceTypeBySlug= ~ slug:", slug);
    const serviceType = await this.prisma.servicesType.findFirst({
      where: { slug: slug },
    });
    return serviceType;
  };

  getServiceByServiceTypeIdRepository = async (id: number) => {
    const service = await this.prisma.services.findFirst({
      where: {
        //  serviceTypeId: id
      },
    });
    return service;
  };

  isServiceExist = async (title: string): Promise<any> => {
    return await this.prisma.services.findFirst({
      where: { title: title },
    });
  };


  async isServiceExistBySlug(slug: string): Promise<any> {
    return await this.prisma.services.findFirst({
      where: { slug: slug },
    });
  }

  isServiceTypeExitById = async (id: number) => {
    const serviceType = await this.prisma.servicesType.findUnique({
      where: { id: id },
    });
    return serviceType;
  };

  isServiceExitBySlug = async (slug: string) => {
    console.log("🚀 ~ services.repository.ts:74 ~ ServicesRepository ~ isServiceExitBySlug= ~ slug:", slug);
    const service = await this.prisma.services.findUnique({
      where: { slug: slug },
    });
    return service;
  };


  // ------------------------------------------------------------
  // ------------------- create service type -------------------
  // ------------------------------------------------------------

  createServiceTypeRepository = async (body: { title: string; slug: string }): Promise<any> => {
    return await this.prisma.servicesType.create({
      data: {
        title: body.title,
        slug: body.slug,
      },
    });
  };

  getAllServiceTypes = async (): Promise<ServiceTypeI[] | []> => {
    const allServiceTypes = await this.prisma.servicesType.findMany();
    return allServiceTypes;
  };

  getServiceTypesWithPagination = async (payload: any): Promise<any> => {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.servicesType.findMany({
          skip: offset,
          take: limit,
        }),
        this.prisma.servicesType.count(),
      ]);

      return { doc, totalDoc };
    });
  };

  updateServiceTypeRepository = async (slug: string, payload: { title: string; id: number }): Promise<any> => {
    return await this.prisma.servicesType.updateMany({
      where: { slug: slug },
      data: {
        slug: slugGenerate(payload.title),
        title: payload.title,
        id: payload.id,
      },
    });
  };

  deleteServiceTypeRepository = async (slug: string) => {
    const serviceType = await this.prisma.servicesType.deleteMany({
      where: { slug: slug },
    });
    return serviceType;
  };

  // ------------------------------------------------------------
  // ------------------- create service  -------------------
  // ------------------------------------------------------------

  createService = async (servicePayload: CreateServiceRequestDTO): Promise<any> => {
    return await this.prisma.services.create({
      data: {
        title: servicePayload.title,
        slug: servicePayload.slug,
        description: servicePayload.description,
        servicesTypeId: servicePayload.serviceTypeId,
      },
    });
  };


  getAllServices = async () => {
    const allServices = await this.prisma.services.findMany({
      select: {
        id: true,
        title: true,
        servicesTypeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return allServices
  };

  updateServiceRepository = async (slug: string, body: Partial<ServiceRequestDTO>): Promise<any> => {
    console.log("🚀 ~ services.repository.ts:132 ~ body:", body);
    return await this.prisma.services.update({
      where: { slug: slug },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        servicesTypeId: body.serviceTypeId,
      },
    });
  };

    async getServicesWithPagination(payload: {  page: number; limit: number }, tx: any): Promise<any> {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.services.findMany({
          where: {},
          skip: offset,
          take: limit,
          include: {
            servicesType: true,
          },
        }),
        this.prisma.services.count({ where: {} }),
      ]);
      return { doc, totalDoc };
    });
  }

    deleteService = async (slug: string) => {
    return await this.prisma.services.delete({
      where: { slug },
    });
  };




    // ------------------------------------------------------------
  // ------------------- helpful count -------------------
  // ------------------------------------------------------------
    async addHelpfulCount(slug: string, payload: { increase: boolean }): Promise<any> {
    return await this.prisma.services.update({
      where: { slug: slug },
      data: {
        helpfulCount: payload.increase
          ? { increment: 1 }
          : { decrement: 1 },
      },
    });
  }

  // getSingleServiceByIdRepository = async (id: string) => {
  //   const serviceId = parseInt(id, 10);
  //   const service = await this.prisma.services.findUnique({
  //     where: { id: serviceId },
  //   });
  //   return service;
  // };

  // getAllServicesCount = async () => {
  //   const servicesCount = await this.prisma.services.count();
  //   return servicesCount;
  // };

  // getAllServiceRepository = async ({ limit, offset, order = "desc" }: { limit: number; offset: number; order?: "asc" | "desc" }) => {
  //   return this.prisma.services.findMany({
  //     skip: offset,
  //     take: limit,
  //     orderBy: { createdAt: order },
  //   });
  // };

  // addUnhelpfulCount = async (id: number, notHelpfulCount: number): Promise<any> => {
  //   const updatedService = await this.prisma.services.update({
  //     where: { id: id },
  //     data: { notHelpfulCount: notHelpfulCount },
  //   });
  //   return updatedService;
  // };
})();
