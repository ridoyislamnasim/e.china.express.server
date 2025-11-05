import { NotFoundError } from '../../utils/errors';
import BaseService from '../base/base.service';
import productRepository from './product.repository';
import inventoryRepository from '../inventory/inventory.repository';
import { calculateDiscountAmount } from '../../utils/calculation';
import ImgUploader from '../../middleware/upload/ImgUploder';
import { idGenerate } from '../../utils/IdGenerator';
import { generateEAN13Barcode } from '../../utils/barcodeGenerate';
import subCategoryRepository from '../subCategory/sub.category.repository';
import categoryRepository from '../category/category.repository';
import prisma from '../../config/prismadatabase';
import { slugGenerate } from '../../utils/slugGenerate';
import config from '../../config/config';
import e1688 from '../../utils/e1688';
import process1688ProductDetail from '../../utils/1688Processedata';
import { process1688ProductDetailTest } from '../../utils/1688ProcessedataTest';
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

export class ProductService {
  private repository: typeof productRepository;
  constructor(
    repository: typeof productRepository,
  ) {
    this.repository = repository;

  }

  // 1688 API Service
  async get1688ProductDetails(payload: any) {
  try {
    const { productId } = payload; // your product / offer ID
console.log('Fetching 1688 product details for productId:', productId);
  // === Setup Required Values (from config with sensible fallbacks) ===
  const appSecret = config.e1688AppSecret || "U1IH8T6UoQxf";
  const access_token = config.e1688AccessToken || "793b6857-359d-494b-bc2b-e3b37bc87c12";
  const offerId = productId || config.e1688DefaultOfferId || "714232053871";

  // === API endpoint & URI path ===
  const apiBaseUrl = config.e1688ApiBaseUrl || "https://gw.open.1688.com/openapi/";
  const uriPath = config.e1688UriPath || "param2/1/com.alibaba.fenxiao.crossborder/product.search.queryProductDetail/9077165";

    // === Request parameters ===
    const offerDetailParam = JSON.stringify({
      offerId,
      country: "en",
    });

    const params: Record<string, string> = {
      access_token,
      offerDetailParam,
    };

    // Use shared util to call 1688 API (generates signature and sends request)
    const responseData = await e1688.call1688(apiBaseUrl, uriPath, params, appSecret);

    // Process the external payload into a compact product shape
    const processed = process1688ProductDetail(responseData);

    // Preserve the original API metadata (like success/code) and place
    // the processed product under result.result so controller response
    // will become: { data: { result: { ...meta..., result: { ...product } } } }
    const apiMeta = responseData?.result ? { ...responseData.result } : {};
    const normalized = {
      result: {
        result: processed,
        responseData:responseData
      },
    };

    return processed;
  } catch (error) {
    // console.error("❌ Error fetching 1688 product details:", error.message);
    throw error;
  }

  }

    async process1688ProductDetailTest(payload: any) {
  try {
    const { productId } = payload; // your product / offer ID
console.log('Fetching 1688 product details for productId:', productId);
  // === Setup Required Values (from config with sensible fallbacks) ===
  const appSecret = config.e1688AppSecret || "U1IH8T6UoQxf";
  const access_token = config.e1688AccessToken || "793b6857-359d-494b-bc2b-e3b37bc87c12";
  const offerId = productId || config.e1688DefaultOfferId || "714232053871";

  // === API endpoint & URI path ===
  const apiBaseUrl = config.e1688ApiBaseUrl || "https://gw.open.1688.com/openapi/";
  const uriPath = config.e1688UriPath || "param2/1/com.alibaba.fenxiao.crossborder/product.search.queryProductDetail/9077165";

    // === Request parameters ===
    const offerDetailParam = JSON.stringify({
      offerId,
      country: "en",
    });

    const params: Record<string, string> = {
      access_token,
      offerDetailParam,
    };

    // Use shared util to call 1688 API (generates signature and sends request)
    const responseData = await e1688.call1688(apiBaseUrl, uriPath, params, appSecret);

    // Process the external payload into a compact product shape
    const processed = process1688ProductDetailTest(responseData);

    // Preserve the original API metadata (like success/code) and place
    // the processed product under result.result so controller response
    // will become: { data: { result: { ...meta..., result: { ...product } } } }
    const apiMeta = responseData?.result ? { ...responseData.result } : {};
    const normalized = {
      result: {
        result: processed,
        responseData:responseData
      },
    };

    return processed;
  } catch (error) {
    // console.error("❌ Error fetching 1688 product details:", error.message);
    throw error;
  }

  }

    /**
   * Search/list products from 1688 with pagination.
   * payload: { q?: string, page?: number, limit?: number }
   */
  // async get1688Products(payload: any) {
  //   try {
  //     const q = payload.q || '';
  //     const page = Number(payload.page ?? 1);
  //     const limit = Number(payload.limit ?? 20);

  //     // use config values
  //     const appSecret = config.e1688AppSecret || '';
  //     const access_token = config.e1688AccessToken || '';
  //     const apiBaseUrl = config.e1688ApiBaseUrl || 'https://gw.open.1688.com/openapi/';
  //     // Allow separate search uri path via env, otherwise use commonly expected search path
  //     const uriPath = config.e1688UriPath || 'param2/1/com.alibaba.fenxiao.crossborder/product.search.queryProductDetail/9077165';

  //     // Build search parameters according to 1688 API expected keys. We'll include access_token and a search param.
  //     // If real 1688 API expects different param names, update this mapping accordingly.
  //     const searchParamObj: Record<string, string> = {
  //       access_token,
  //       // Use 'keywords' or 'q' depending on API; keep as 'keywords' for compatibility
  //       keywords: q,
  //       page: String(page),
  //       pageSize: String(limit),
  //     } as Record<string, string>;

  //     // call shared util
  //     const data = await e1688.call1688(apiBaseUrl, uriPath, searchParamObj, appSecret);

  //     // Normalize response into paginated shape
  //     // The actual 1688 response structure may differ; return raw data along with pagination metadata
  //     return {
  //       page,
  //       limit,
  //       result: data,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async createProduct(payloadFiles: any, payload: any, tx?: any) {
    // --- Begin migrated logic ---
    const { files } = payloadFiles;
    const {
      barcode,
      mrpPrice,
      discountType,
      discount,
      inventoryType,
      inventory,
      inventoryArray,
      inventorys,
    } = payload;
    let inventoryIds: number[] = [];
    let totalInventoryCount = 0;
    let maxPrice = 100000;
    payload.inventoryType = inventoryType;

    if (discountType && discount) {
      payload.isDiscounted = true;
      payload.discountType = discountType;
      payload.discount = discount;
    }

    // Inventory creation logic
    if (inventoryType === "colorInventory") {
      let inventoryTotal = 0;
      let newInventoryId = "";
      for (const item of inventoryArray) {
        const color = item.colorCode || "#000000";
        const name = item.color || "Unknown";
        const quantity = parseInt(item.quantity) || 0;
        const itemMrpPrice = Number(item.mrpPrice);
        inventoryTotal += quantity;
        const title = "INV-";
        if (newInventoryId === "") {
          newInventoryId = await idGenerate(
            "INV-",
            "inventoryID",
            prisma.inventory
          );
        } else {
          let id = Number(newInventoryId.slice(title.length + 6)) + 1;
          let prefix = newInventoryId.slice(0, title.length + 6);
          newInventoryId = prefix + id;
        }
        const newInventory: any = {
          quantity: quantity,
          availableQuantity: quantity,
          inventoryType: inventoryType,
          color,
          name,
          barcode: item.barcode || generateEAN13Barcode(),
          inventoryID: newInventoryId,
          mrpPrice: itemMrpPrice,
        };
        if (discountType && discount) {
          // @ts-ignore
          const { price, discountAmount } = calculateDiscountAmount(
            itemMrpPrice,
            discountType,
            discount
          );
          console.log('Calculated price:', price, 'Discount Amount:', discountAmount);
          newInventory.price = price;
          newInventory.discountAmount = discountAmount;
          newInventory.discountType = discountType;
        } else {
          newInventory.price = itemMrpPrice;
        }
        maxPrice = newInventory?.price && Math.min(maxPrice, newInventory?.price);
        const createdInventory = await inventoryRepository.createNewInventory(newInventory);
        inventoryIds.push(createdInventory.id);
      }
    } else if (inventoryType === "levelInventory") {
      let inventoryTotal = 0;
      let newInventoryId = "";
      for (const item of inventoryArray) {
        const level = item.level || "Unknown";
        const quantity = Number(item.quantity) || 0;
        const itemMrpPrice = Number(item.mrpPrice);
        inventoryTotal += quantity;
        const title = "INV-";
        if (newInventoryId === "") {
          newInventoryId = await idGenerate(
            title,
            "inventoryID",
            prisma.inventory
          );
        } else {
          let id = Number(newInventoryId.slice(title.length + 6)) + 1;
          let prefix = newInventoryId.slice(0, title.length + 6);
          newInventoryId = prefix + id;
        }
        const newInventory: any = {
          level: level,
          barcode: item.barcode || generateEAN13Barcode(),
          quantity: quantity,
          availableQuantity: quantity,
          inventoryType: inventoryType,
          inventoryID: newInventoryId,
          mrpPrice: itemMrpPrice,
        };
        if (discountType && discount) {
          // @ts-ignore
          const { price, discountAmount } = calculateDiscountAmount(
            itemMrpPrice,
            discountType,
            discount
          );
          console.log('Calculated price:', price, 'Discount Amount:', discountAmount);
          newInventory.price = price;
          newInventory.discountAmount = discountAmount;
          newInventory.discountType = discountType;
        } else {
          newInventory.price = itemMrpPrice;
        }
        console.log('New Inventory:', newInventory);
        maxPrice = newInventory?.price && Math.min(maxPrice, newInventory?.price);
        const createdInventory = await inventoryRepository.createNewInventory(newInventory);
        inventoryIds.push(createdInventory.id);
      }
    } else if (inventoryType === "colorLevelInventory") {
      console.log('Creating color level inventory');
      let newInventoryID = "";
      for (const item of inventoryArray) {
        const level = item.level || "Unknown";
        const variants = item.colorLevel;
        const title = "INV-";
        // for (const variant of variants) {
          if (newInventoryID === "") {
            newInventoryID = await idGenerate(
              title,
              "inventoryID",
              prisma.inventory
            );
          } else {
            let id = Number(newInventoryID.slice(title.length + 6)) + 1;
            let prefix = newInventoryID.slice(0, title.length + 6);
            newInventoryID = prefix + id;
          }
          const newInventory: any = {
            quantity: Number(item.quantity),
            availableQuantity: Number(item.quantity),
            color: item.colorCode || "#000000",
            name: item.color || "Unknown",
            level: level,
            barcode: item.barcode || generateEAN13Barcode(),
            inventoryID: newInventoryID,
            mrpPrice: Number(item.mrpPrice),
            inventoryType: inventoryType,
          };
          if (discountType && discount) {
            // @ts-ignore
            const { price, discountAmount } = calculateDiscountAmount(
              Number(item.mrpPrice),
              discountType,
              discount
            );
            newInventory.price = price;
            newInventory.discountAmount = discountAmount;
            newInventory.discountType = discountType;
          } else {
            newInventory.price = Number(item.mrpPrice);
          }
          maxPrice = newInventory?.price && Math.min(maxPrice, newInventory?.price);
          const createdInventory = await inventoryRepository.createNewInventory(newInventory);
          inventoryIds.push(createdInventory.id);
        // }
      }
    } else {
      payload.inventoryType = "inventory";
      const newInventoryID = await idGenerate(
        "INV-",
        "inventoryID",
        prisma.inventory
      );
      const newInventory: any = {
        costPrice: Number(inventoryArray[0]?.costPrice || 0),
        quantity: Number(inventoryArray[0]?.quantity || 0),
        mrpPrice: Number(inventoryArray[0]?.mrpPrice || 0),
        barcode: inventoryArray[0]?.barcode || generateEAN13Barcode(),
        availableQuantity: Number(inventoryArray[0]?.quantity || 0),
        inventoryType: inventoryType,
        inventoryID: newInventoryID,
      };
      if (discountType && discount) {
        // @ts-ignore
        const { price, discountAmount } = calculateDiscountAmount(
          Number(inventoryArray[0]?.mrpPrice),
          discountType,
          discount
        );
        newInventory.price = price;
        newInventory.discountAmount = discountAmount;
        newInventory.discountType = discountType;
      } else {
        newInventory.price = Number(inventoryArray[0]?.mrpPrice);
      }
      maxPrice = newInventory?.price;
      const createdInventory = await inventoryRepository.createNewInventory(newInventory);
      inventoryIds.push(createdInventory.id);
    }

    payload.mainInventory = totalInventoryCount;
    // Relate inventories using Prisma connect syntax
    console.log('Inventory IDs:', inventoryIds);
    if (inventoryIds.length) {
      payload.inventories = {
        connect: inventoryIds.map(id => ({ id: Number(id) }))
      };
    }
    // Remove inventoryRef from payload if present
    delete payload.inventoryRef;

    // Add Prisma relation connect for categoryRef and subCategoryRef
    if (payload.categoryRef) {
      payload.categoryRefId = Number(payload.categoryRef);
      delete payload.categoryRef;
    }
    if (payload.subCategoryRef) {
      payload.subCategoryRefId = Number(payload.subCategoryRef);
      delete payload.subCategoryRef;
    }else{
      delete payload.subCategoryRef;
    }

    if (!files?.length) {
      const error = new Error("Thumbnail Image is required");
      (error as any).statusCode = 400;
      throw error;
    }
    const hasThumbnailImage = files.some(
      (file: any) => file.fieldname === "thumbnailImage"
    );
    if (!hasThumbnailImage) {
      const error = new Error("Thumbnail Image is required");
      (error as any).statusCode = 400;
      throw error;
    }
    let images = await ImgUploader(files);
    for (const key in images) {
      payload[key] = images[key];
    }

    payload.productId = await idGenerate("PRO-", "productId", prisma.product);
    console.log("Payload before creating product:", payload.productId);
    payload.price = maxPrice;
    payload.slug = slugGenerate(payload.name);
    console.log('Payload before creating product:', payload);
    // Remove inventoryArray from payload before creating product
    delete payload.inventoryArray;
    console.log('Payload before creating product:2', payload);

    const productData = await this.repository.createProduct(payload);
    // if (productData) {
    //   for (const inventoryId of inventoryIds) {
    //     await inventoryRepository.updateById(
    //       Number(inventoryId),
    //       { productRef: String(productData.id) }
    //     );
    //   }
    // }
    return productData;
    // --- End migrated logic ---
  }

  async getAllProduct() {
    return await this.repository.getAllProduct();
  }

  async getAllBestSellProduct(payload: any) {
    const product = await this.repository.getAllBestSellProduct(payload);
    return product;
  }

  async getAllDiscountedProduct(payload: any) {
    const product = await this.repository.getAllDiscountedProduct(payload);
    return product;
  }

    async getShopOption() {
      const products = await this.repository.getShopOption();
      return { products };
    }

  //   async getAllProductForHomePage(payload: any) {
  //     const { limit, viewType } = payload;
  //     if (!viewType) throw new NotFoundError('viewType is required');
  //     const subCategory = await this.subCategoryRepository.findOne({ viewType });
  //     if (!subCategory) throw new NotFoundError('SubCategory not found');
  //     payload.subCategoryRef = subCategory.id;
  //     const product = await this.repository.getAllProductForHomePage(payload);
  //     return { product, subCategory };
  //   }

  async getRelatedProduct(payload: any) {
    return await this.repository.getRelatedProduct(payload);
  }

  //   async getSearchProduct(payload: any) {
  //     return await this.repository.getSearchProduct(payload);
  //   }

  async getProductWithPagination(payload: any) {
    return await this.repository.getProductWithPagination(payload);
  }

  async getProductWithPaginationForAdmin(payload: any) {
    return await this.repository.getProductWithPaginationForAdmin(payload);
  }
  async getProductViewCount(payload: any) {
    return await this.repository.getProductViewCount(payload);
  }
  async getNewArrivalsProductWithPagination(payload: any) {
    return await this.repository.getNewArrivalsProductWithPagination(payload);
  }

  async getTrendingProductsWithPagination(payload: any) {
    return await this.repository.getTrendingProductsWithPagination(payload);
  }

  async getComingSoonProductWithPagination(payload: any) {
    return await this.repository.getComingSoonProductWithPagination(payload);
  }

  async getSingleProduct(slug: string) {
    const productData = await this.repository.getSingleProduct(slug);
    if (!productData) {
      const error = new Error('Product Not Find');
      (error as any).statusCode = 404;
      throw error;
    }
    return productData;
  }

  async updateProduct(slug: string, payloadFiles: any, payload: any, session?: any) {
    // ...implement update logic as needed, similar to createProduct
    return await this.repository.updateProduct(slug, payload);
  }

  //   async updateProductStatus(slug: number, status: any) {
  //     if (!status) throw new NotFoundError('Status is required');
  //     const boolStatus = status === true || status === 'true';
  //     const product = await this.repository.updateProduct(slug, { status: boolStatus });
  //     if (!product) throw new NotFoundError('Product not found');
  //     return product;
  //   }

  async deleteProduct(slug: string, session?: any) {
    const deletedProduct = await this.repository.deleteProduct(slug);
    // Optionally remove images
    // if (deletedProduct?.thumbnailImage) {
    //   await removeUploadFile(product?.thumbnailImage);
    // }
    // if (deletedProduct?.backViewImage) {
    //   await removeUploadFile(product?.backViewImage);
    // }
    // if (Array.isArray(deletedProduct?.images)) {
    //   for (const image of deletedProduct.images) {
    //     await removeUploadFile(image);
    //   }
    // }
    return deletedProduct;
  }

  //   async getCategoriesWithSubcategoriesAndCounts() {
  //     return await this.repository.getCategoriesWithSubcategoriesAndCounts();
  //   }
}

const productService = new ProductService(
  productRepository,
);
export default productService;
