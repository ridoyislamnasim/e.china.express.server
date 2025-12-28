// import RateProductPayload from "../../types/rateProduct";
import RateProductPayload from "../../types/rateProduct";
import ratePorductRepository, { RatePorductRepository } from "./rateProduct.repository";


export class RatePorductService {
  private repository: RatePorductRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: RatePorductRepository = ratePorductRepository) {
    this.repository = repository;
  }
  async createRateProduct(payload: RateProductPayload): Promise<any> {
    const { categoryName, categoryShCode, categoryDescription, subCategoryName, subCategoryShCode, subCategoryDescription, subHeadingName, subHeadingShCode, subHeadingDescription, productName, status } = payload;
console.log("payload service", payload);
const productShCode = categoryShCode + subCategoryShCode + subHeadingShCode;
    // Validate required fields
    if (!productName || !productShCode || !categoryName || !categoryShCode || !subCategoryName || !subCategoryShCode || !subHeadingName || !subHeadingShCode) {
      const error = new Error("Missing required fields: productName, productShCode, categoryName, categoryShCode, subCategoryName, subCategoryShCode, subHeadingName, or subHeadingShCode.");
      (error as any).statusCode = 400;
      throw error;
    }

    // define payloads for existence checks
    const categoryPayload = {
      name: categoryName,
      shCategoryCode: categoryShCode,
      description: categoryDescription ?? null
    }
    const subCategoryPayload = {
      name: subCategoryName,
      shSubCategoryCode: subCategoryShCode,
      description: subCategoryDescription ?? null
    }
    const subHeadingPayload = {
      name: subHeadingName,
      hsSubHeadingCode: subHeadingShCode,
      description: subHeadingDescription ?? null
    }
    //exist category ,subcategory , subheading
    const existCategory = await this.repository.existCategory(categoryPayload);
    const existSubCategory = await this.repository.existSubCategory(subCategoryPayload);
    const existSubHeading = await this.repository.existSubHeading(subHeadingPayload);

    // create category, subcategory , subheading if not exist
    const newCategory = !existCategory ? await this.repository.createCategory(categoryPayload) : null;
    const newSubCategory = !existSubCategory ? await this.repository.createSubCategory(subCategoryPayload) : null;
    const newSubHeading = !existSubHeading ? await this.repository.createSubHeading(subHeadingPayload) : null;

    const categoryId = existCategory?.id ?? newCategory?.id;
    const subcategoryId = existSubCategory?.id ?? newSubCategory?.id;
    const subheadingId = existSubHeading?.id ?? newSubHeading?.id;

    if (!categoryId || !subcategoryId || !subheadingId) {
      const error = new Error(
        "Failed to create or find required category, subcategory, or subheading. Please check the provided data."
      );
      (error as any).statusCode = 500;
      throw error;
    }

    const rateProductPayload = {
      categoryId, subcategoryId, subheadingId, name: productName, shCode: productShCode
    };
    if (status) {
      (rateProductPayload as any).status = status;
    }
    console.log("rateProductPayload service", rateProductPayload);
    const shippingMethod = await this.repository.createRateProduct(rateProductPayload);
    return shippingMethod;
  }

  async getAllRateProduct(): Promise<any> {
    const rateProducts = await this.repository.getAllRateProduct();
    return rateProducts;
  }

}

