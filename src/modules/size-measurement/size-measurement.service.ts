import { CreateSizeMeasurementRequestDTO, SizeMeasurementTypeDTO, SizeMeasurementTypeI } from "../../types/size-measurement";
import { NotFoundError } from "../../utils/errors";
import { pagination } from "../../utils/pagination";
import { slugGenerate } from "../../utils/slugGenerate";
import sizeMeasurementRepository from "./size-measurement.repository";

export default new (class SizeMeasurementService {
  getAllSizeMeasurementTypes = async () => {
    try {
      const allSizeMeasurementTypes: SizeMeasurementTypeI[] | [] = await sizeMeasurementRepository.getAllSizeMeasurementTypesRepository();
      return allSizeMeasurementTypes;
    } catch (error) {
      console.error("Error getting size-measurement types:", error);
      throw error;
    }
  };

  createSizeMeasurementType = async (payload: SizeMeasurementTypeDTO): Promise<any> => {
    const missingFields: string[] = [];
    if (!payload.title) missingFields.push("title");
    if (missingFields.length > 0) {
      const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
      (error as any).statusCode = 400;
      throw error;
    }
    const { title } = payload;
    const slug = slugGenerate(title);
    try {
      const sizeMeasurementType = await sizeMeasurementRepository.createSizeMeasurementTypeRepository({
        title,
        slug,
      });
      return sizeMeasurementType;
    } catch (error: any) {
      console.error("Error creating size-measurement type:", error);
      throw error;
    }
  };

  updateSizeMeasurementType = async (slug: string, body: { title: string; id: number }) => {
    let sizeMeasurementType;
    if (!slug) {
      const error = new Error("Size-measurement type slug is Missing.");
      (error as any).statusCode = 400;
      throw error;
    } else {
      sizeMeasurementType = await sizeMeasurementRepository.getSizeMeasurementTypeBySlugRepository(slug);
      if (!sizeMeasurementType) {
        const error = new Error("Size-measurement type not found");
        (error as any).statusCode = 404;
        throw error;
      }
    }
    try {
      const updatedSizeMeasurementType = await sizeMeasurementRepository.updateSizeMeasurementTypeRepository(sizeMeasurementType.slug, body);
      return updatedSizeMeasurementType;
    } catch (error) {
      console.error("Error updating size-measurement type:", error);
      throw error;
    }
  };

  getSizeMeasurementTypesWithPagination = async (payload: { page: number; limit: number }): Promise<any> => {
    const { page, limit } = payload;
    const sizeMeasurementTypes = await sizeMeasurementRepository.getSizeMeasurementTypesWithPagination({ limit, page });
    return sizeMeasurementTypes;
  };

  deleteSizeMeasurementType = async (slug: string) => {
    let sizeMeasurementType;

    if (!slug) {
      const error = new Error("Policy type is Missing.");
      (error as any).statusCode = 400;
      throw error;
    } else {
      sizeMeasurementType = await sizeMeasurementRepository.getSizeMeasurementTypeBySlugRepository(slug);
      if (!sizeMeasurementType) {
        const error = new Error("Size-measurement type not found");
        (error as any).statusCode = 404;
        throw error;
      }
    }

    try {
      const sizeMeasurementExistWithCurrentType = await sizeMeasurementRepository.getSizeMeasurementByTypeIdRepository(sizeMeasurementType.id);
      if (sizeMeasurementExistWithCurrentType) {
        const error = new Error("Cannot delete size-measurement type. Size-measurements exist with this type.");
        (error as any).statusCode = 400;
        throw error;
      } else {
        return await sizeMeasurementRepository.deleteSizeMeasurementTypeRepository(slug);
      }
    } catch (error) {
      console.error("Error deleting size-measurement type:", error);
      throw error;
    }
  };

  getAllSizeMeasurementTableView = async (payload: { page?: number; limit?: number; order?: "asc" | "desc" }) => {
    try {
      return await pagination(payload, async (limit: number, offset: number) => {
        const [sizeMeasurements, totalDoc] = await Promise.all([
          sizeMeasurementRepository.getAllSizeMeasurementRepository({
            limit,
            offset,
            order: payload.order,
          }),
          sizeMeasurementRepository.getAllSizeMeasurementsCount(),
        ]);

        if (!sizeMeasurements || sizeMeasurements.length === 0) {
          return { doc: [], totalDoc };
        }
        const doc = await Promise.all(
          sizeMeasurements.map(async (sizeMeasurement) => {
            // type should be fetched by the sizeMeasurement's `policyTypeId`
            const sizeMeasurementType = await sizeMeasurementRepository.getSizeMeasurementTypeByIdRepository(sizeMeasurement.sizeMeasurementTypeId);
            return {
              id: sizeMeasurement.id,
              title: sizeMeasurement.title,
              description: sizeMeasurement.description,
              sizeMeasurementTypeId: sizeMeasurement.sizeMeasurementTypeId,
              sizeMeasurementType: sizeMeasurementType?.title ?? null,
              sizeMeasurementTypeSlug: sizeMeasurementType?.slug ?? null,
              createdAt: sizeMeasurement.createdAt,
              updatedAt: sizeMeasurement.updatedAt,
            };
          }),
        );

        return { doc, totalDoc };
      });
    } catch (error) {
      console.error("Error getting size-measurement table view:", error);
      throw error;
    }
  };

  getSingleSizeMeasurementById = async (id: string) => {
    try {
      if (!id) {
        const error = new Error("Size Measurement ID is missing.");
        (error as any).statusCode = 400;
        throw error;
      }
      const sizeMeasurement = await sizeMeasurementRepository.getSingleSizeMeasurementByIdRepository(id);
      if (!sizeMeasurement) {
        const error = new Error(`No size-measurement found for ID ${id}`);
        (error as any).statusCode = 404;
        throw error;
      }
      return sizeMeasurement;
    } catch (error) {
      console.error("Error getting size-measurement by ID:", error);
      throw error;
    }
  };

  getAllSizeMeasurementTitles = async () => {
    try {
      const { sizeMeasurement, sizeMeasurementTypes } = await sizeMeasurementRepository.getAllSizeMeasurementTitlesRepository();

      if (!sizeMeasurement || !sizeMeasurementTypes) {
        const error = new Error(`Something went wrong. Policies not Found.`);
        (error as any).statusCode = 400;
        throw error;
      }
      const transformedData = sizeMeasurementTypes.map((sizeMeasurementType) => {
        const relatedSizeMeasurements = sizeMeasurement.filter((sizeMeasurement) => sizeMeasurement.sizeMeasurementTypeId === sizeMeasurementType.id);

        return {
          id: sizeMeasurementType.slug,
          title: sizeMeasurementType.title,
          submenus: relatedSizeMeasurements.map((sizeMeasurement) => ({
            id: sizeMeasurement.id,
            title: sizeMeasurement.title,
            createdAt: sizeMeasurement.createdAt,
            updatedAt: sizeMeasurement.updatedAt,
          })),
        };
      });

      return transformedData;
    } catch (error) {
      console.error("Error getting size-measurement titles:", error);
      throw error;
    }
  };

  createSizeMeasurement = async (payload: CreateSizeMeasurementRequestDTO): Promise<any> => {
    const { title, description, sizeMeasurementTypeId } = payload;
    console.log("🚀 ~ size-measurement.service.ts:197 ~ payload:", payload);
    console.log("🚀 ~ size-measurement.service.ts:197 ~ sizeMeasurementId:", sizeMeasurementTypeId);

    if (!title || !sizeMeasurementTypeId || !description) {
      const missingFields: string[] = [];
      if (!title) missingFields.push("title");
      if (!sizeMeasurementTypeId) missingFields.push("sizeMeasurementId");
      if (!description) missingFields.push("description");

      const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
      (error as any).statusCode = 400;
      throw error;
    }

    try {
      const existingSizeMeasurement = await sizeMeasurementRepository.isSizeMeasurementExist(title);
      if (existingSizeMeasurement) {
        const error = new Error(`Size-measurement with title "${title}" already exists`);
        (error as any).statusCode = 409; // Conflict
        throw error;
      }

      const sizeMeasurementPayload: CreateSizeMeasurementRequestDTO = {
        title,
        description,
        sizeMeasurementTypeId,
      };

      const sizeMeasurement = await sizeMeasurementRepository.createSizeMeasurementRepository(sizeMeasurementPayload);

      return sizeMeasurement;
    } catch (error) {
      console.error("Error creating size-measurement:", error);
      throw error;
    }
  };

  getSizeMeasurementById = async (slug: string) => {
    try {
      const sizeMeasurementType = await sizeMeasurementRepository.getSizeMeasurementTypeBySlugRepository(slug);
      if (sizeMeasurementType) {
        try {
          const { id } = sizeMeasurementType;
          const sizeMeasurement = await sizeMeasurementRepository.getSizeMeasurementByTypeIdRepository(id);
          return sizeMeasurement;
        } catch (error) {
          console.error("Error finding size-measurement:", error);
          throw error;
        }
      } else {
        throw new NotFoundError(`No size-measurement found for type ${slug}`);
      }
    } catch (error) {
      console.error("Error finding size-measurement:", error);
      throw error;
    }
  };

  updateSizeMeasurement = async (slug: string, body: Partial<CreateSizeMeasurementRequestDTO>) => {
    console.log("🚀 ~ size-measurement.service.ts:271 ~ body:", body);
    try {
      const missingFields: string[] = [];
      if (!body.title) missingFields.push("title");
      if (!body.description) missingFields.push("description");
      if (!body.sizeMeasurementTypeId) missingFields.push("size Measurement Id");

      if (missingFields.length > 0) {
        const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
        (error as any).statusCode = 400;
        throw error;
      }

      const isSizeMeasurementTypeExist = await sizeMeasurementRepository.getSizeMeasurementTypeByIdRepository(body.sizeMeasurementTypeId!);
      console.log("🚀 ~ size-measurement.service.ts:285 ~ isSizeMeasurementTypeExist:", isSizeMeasurementTypeExist);
      if (!isSizeMeasurementTypeExist) {
        const error = new Error("Size-measurement type not found");
        (error as any).statusCode = 404;
        throw error;
      }

      const isSizeMeasurementExist = await sizeMeasurementRepository.getSizeMeasurementByIdRepository(body.id!);
      console.log("🚀 ~ size-measurement.service.ts:293 ~ isSizeMeasurementExist:", isSizeMeasurementExist);
      if (!isSizeMeasurementExist) {
        const error = new Error("Size-measurement not found");
        (error as any).statusCode = 404;
        throw error;
      }

      const update = await sizeMeasurementRepository.updateSizeMeasurementRepository(body.id!, body);

      return update;
    } catch (error) {
      console.error("Error updating size-measurement:", error);
      throw error;
    }
  };

  getAllSizeMeasurementsCount = async () => {
    try {
      return await sizeMeasurementRepository.getAllSizeMeasurementsCount();
    } catch (e) {
      console.error(e);
      const error = new Error("Failed to fetch size-measurements count");
      (error as any).statusCode = 500;
      throw error;
    }
  };

  deleteSizeMeasurement = async (paramId: number) => {
    try {
      const id = paramId;
      if (!id) {
        const error = new Error("Missing required field: id");
        (error as any).statusCode = 400;
        throw error;
      }
      const sizeMeasurement = await sizeMeasurementRepository.getSizeMeasurementByIdRepository(id);
      if (!sizeMeasurement) {
        const error = new Error("Size-measurement not found");
        (error as any).statusCode = 404;
        throw error;
      }
      return await sizeMeasurementRepository.deleteSizeMeasurementRepository(id);
    } catch (error: any) {
      console.error("Error deleting size-measurement:", error);
      throw error;
    }
  };

  // createPolicyType = async ( payload: CreatePolicyTypeRequestDTO ): Promise<any> => {
  //   const { title } = payload;
  //   const slug = slugGenerate(title);

  //   if (!title || !slug) {
  //     const missingFields: string[] = [];
  //     if (!title) missingFields.push("title");
  //     if (!slug) missingFields.push("slug");

  //     const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
  //     (error as any).statusCode = 400;
  //     throw error;
  //   }

  //   try {
  //     const policyType = await policiesRepository.createPolicyTypeRepository({ title, slug});
  //     return policyType;
  //   } catch (error: any) {
  //     console.error("Error creating policy type:", error);

  //   }
  // };

  async getSizeMeasurementsWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;
    const sizeMeasurementTypes = await sizeMeasurementRepository.getSizeMeasurementsWithPagination({ limit, offset }, tx);
    return sizeMeasurementTypes;
  }

  // addHelpfulCount = async (id: number): Promise<any> => {
  //   try {
  //     if (!id) {
  //       const error = new Error("Missing required field: id");
  //       (error as any).statusCode = 400;
  //       throw error;
  //     }

  //     const sizeMeasurement = await sizeMeasurementRepository.getSizeMeasurementByIdRepository(id);
  //     if (!sizeMeasurement) {
  //       const error = new Error(`Size-measurement not found for id ${id}`);
  //       (error as any).statusCode = 404;
  //       throw error;
  //     }

  //     const { id: sizeMeasurementId, title, description, policyTypeId, helpfulCount: helpfulCounter, notHelpfulCount, createdAt, updatedAt }: PoliciesI = sizeMeasurement;
  //     const payload = { id: sizeMeasurementId, title, description, policyTypeId, helpfulCount: helpfulCounter, notHelpfulCount, createdAt, updatedAt };

  //     if (payload?.helpfulCount == null) {
  //       const error = new Error("Missing required field: helpfulCount");
  //       (error as any).statusCode = 400;
  //       throw error;
  //     }
  //     payload.helpfulCount = payload.helpfulCount + 1;

  //     const { helpfulCount } = payload;

  //     const updated = await sizeMeasurementRepository.addHelpfulCount(id, helpfulCount);

  //     return responseHandler(200, "Helpful count updated successfully", updated);
  //   } catch (error: any) {
  //     console.error("Error updating helpful count (size-measurement):", error);
  //     throw error;
  //   }
  // };

  // addUnhelpfulCount = async (id: number): Promise<any> => {
  //   try {
  //     if (!id) {
  //       const error = new Error("Missing required field: id");
  //       (error as any).statusCode = 400;
  //       throw error;
  //     }

  //     const sizeMeasurement = await sizeMeasurementRepository.getSizeMeasurementByIdRepository(id);
  //     if (!sizeMeasurement) {
  //       const error = new Error(`Size-measurement not found for id ${id}`);
  //       (error as any).statusCode = 404;
  //       throw error;
  //     }

  //     const { id: sizeMeasurementId, title, description, policyTypeId, helpfulCount, notHelpfulCount: unhelpfulCounter, createdAt, updatedAt }: PoliciesI = sizeMeasurement;

  //     const payload = {
  //       id: sizeMeasurementId,
  //       title,
  //       description,
  //       policyTypeId,
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

  //     const updated = await sizeMeasurementRepository.addUnhelpfulCount(id, notHelpfulCount);

  //     return responseHandler(200, "Unhelpful count updated successfully", updated);
  //   } catch (error: any) {
  //     console.error("Error updating unhelpful count (size-measurement):", error);
  //     throw error;
  //   }
  // };
})();
