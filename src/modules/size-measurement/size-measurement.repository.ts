import prisma from "../../config/prismadatabase";
import { CreatePolicyRequestDTO, PolicyRequestDTO, PolicyTypeI } from "../../types/policy";
import { CreateSizeMeasurementRequestDTO, SizeMeasurementTypeDTO, SizeMeasurementTypeI } from "../../types/size-measurement";
import { pagination } from "../../utils/pagination";
import { slugGenerate } from "../../utils/slugGenerate";

export default new (class SizeMeasurementRepository {
  private prisma = prisma;

  getAllSizeMeasurementTypesRepository = async (): Promise<SizeMeasurementTypeI[] | []> => {
    const allPolicyTypes = await this.prisma.sizeMeasurementType.findMany();
    return allPolicyTypes;
  };

  createSizeMeasurementTypeRepository = async (body: { title: string; slug: string }): Promise<any> => {
    return await this.prisma.sizeMeasurementType.create({
      data: {
        title: body.title,
        slug: body.slug,
      },
    });
  };

  updateSizeMeasurementTypeRepository = async (slug: string, payload: { title: string; id: number }): Promise<any> => {
    return await this.prisma.sizeMeasurementType.updateMany({
      where: { slug: slug },
      data: {
        slug: slugGenerate(payload.title),
        title: payload.title,
        id: payload.id,
      },
    });
  };

  getSizeMeasurementTypeBySlugRepository = async (slug: string) => {
    const sizeMeasurement = await this.prisma.sizeMeasurementType.findFirst({
      where: { slug: slug },
    });
    return sizeMeasurement;
  };

  getSizeMeasurementTypesWithPagination = async (payload: any): Promise<any> => {
    const result = await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.sizeMeasurementType.findMany({
          skip: offset,
          take: limit,

          orderBy: { createdAt: sortOrder },
        }),
        this.prisma.sizeMeasurementType.count({}),
      ]);

      return { doc, totalDoc };
    });

    return result;
  };

  deleteSizeMeasurementTypeRepository = async (slug: string) => {
    const policyType = await this.prisma.sizeMeasurementType.deleteMany({
      where: { slug: slug },
    });
    return policyType;
  };

  getSizeMeasurementByTypeIdRepository = async (id: number) => {
    const sizeMeasurement = await this.prisma.sizeMeasurement.findFirst({
      where: { sizeMeasurementTypeId: id },
    });
    return sizeMeasurement;
  };

  getAllSizeMeasurementRepository = async ({ limit, offset, order = "desc" }: { limit: number; offset: number; order?: "asc" | "desc" }) => {
    const policies = await this.prisma.sizeMeasurement.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: order },
    });

    const mappedPolicies = policies.map((policy) => ({
      ...policy,
    }));

    return mappedPolicies;
  };

  getSingleSizeMeasurementByIdRepository = async (id: string) => {
    const sizeMeasurementId = parseInt(id, 10);
    const sizeMeasurement = await this.prisma.sizeMeasurement.findUnique({
      where: { id: sizeMeasurementId },
    });
    return sizeMeasurement;
  };

  getAllSizeMeasurementTitlesRepository = async () => {
    const sizeMeasurementTypes = await this.prisma.sizeMeasurementType.findMany();
    const sizeMeasurement = await this.prisma.sizeMeasurement.findMany({
      select: {
        id: true,
        title: true,
        sizeMeasurementTypeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { sizeMeasurement, sizeMeasurementTypes };
  };

  isSizeMeasurementExist = async (title: string): Promise<any> => {
    return await this.prisma.sizeMeasurement.findFirst({
      where: { title: title },
    });
  };

  createSizeMeasurementRepository = async (body: CreateSizeMeasurementRequestDTO): Promise<any> => {
    return await this.prisma.sizeMeasurement.create({
      data: {
        title: body.title,
        description: body.description,
        sizeMeasurementTypeId: body.sizeMeasurementTypeId,
      },
    });
  };

  getAllSizeMeasurementsCount = async () => {
    const sizeMeasurementsCount = await this.prisma.sizeMeasurement.count();
    return sizeMeasurementsCount;
  };

  getSizeMeasurementTypeByIdRepository = async (id: number) => {
    const sizeMeasurementType = await this.prisma.sizeMeasurementType.findUnique({
      where: { id: id },
    });
    return sizeMeasurementType;
  };

  getSizeMeasurementByIdRepository = async (id: number) => {
    const sizeMeasurement = await this.prisma.sizeMeasurement.findUnique({
      where: { id: id },
    });
    return sizeMeasurement;
  };

  updateSizeMeasurementRepository = async (sizeMeasurementId: number, body: Partial<CreateSizeMeasurementRequestDTO>): Promise<any> => {
    return await this.prisma.sizeMeasurement.update({
      where: { id: sizeMeasurementId },
      data: {
        title: body.title,
        description: body.description,
        sizeMeasurementTypeId: body.sizeMeasurementTypeId,
      },
    });
  };

  deleteSizeMeasurementRepository = async (id: number) => {
    return await this.prisma.sizeMeasurement.delete({
      where: { id },
    });
  };

  async getSizeMeasurementsWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.sizeMeasurementType.findMany({
          where: {},
          skip: offset,
          take: limit,
        }),
        prisma.sizeMeasurementType.count({ where: {} }),
      ]);
      return { doc, totalDoc };
    });
  }

  // async addHelpfulCount(id: number, helpfulCount: number) {
  //   return await this.prisma.sizeMeasurement.update({
  //     where: { id: id },
  //     data: {
  //       helpfulCount: helpfulCount,
  //     },
  //   });
  // }

  // addUnhelpfulCount = async (id: number, notHelpfulCount: number): Promise<any> => {
  //   const updatedPolicy = await this.prisma.sizeMeasurement.update({
  //     where: { id: id },
  //     data: { notHelpfulCount: notHelpfulCount },
  //   });
  //   return updatedPolicy;
  // };
})();
