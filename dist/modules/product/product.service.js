"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_repository_1 = __importDefault(require("./product.repository"));
const inventory_repository_1 = __importDefault(require("../inventory/inventory.repository"));
const calculation_1 = require("../../utils/calculation");
const ImgUploder_1 = __importDefault(require("../../middleware/upload/ImgUploder"));
const IdGenerator_1 = require("../../utils/IdGenerator");
const barcodeGenerate_1 = require("../../utils/barcodeGenerate");
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const slugGenerate_1 = require("../../utils/slugGenerate");
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';
class ProductService {
    constructor(repository) {
        this.repository = repository;
    }
    async createProduct(payloadFiles, payload, tx) {
        var _a, _b, _c, _d, _e, _f, _g;
        // --- Begin migrated logic ---
        const { files } = payloadFiles;
        const { barcode, mrpPrice, discountType, discount, inventoryType, inventory, inventoryArray, inventorys, } = payload;
        let inventoryIds = [];
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
                    newInventoryId = await (0, IdGenerator_1.idGenerate)("INV-", "inventoryID", prismadatabase_1.default.inventory);
                }
                else {
                    let id = Number(newInventoryId.slice(title.length + 6)) + 1;
                    let prefix = newInventoryId.slice(0, title.length + 6);
                    newInventoryId = prefix + id;
                }
                const newInventory = {
                    quantity: quantity,
                    availableQuantity: quantity,
                    inventoryType: inventoryType,
                    color,
                    name,
                    barcode: item.barcode || (0, barcodeGenerate_1.generateEAN13Barcode)(),
                    inventoryID: newInventoryId,
                    mrpPrice: itemMrpPrice,
                };
                if (discountType && discount) {
                    // @ts-ignore
                    const { price, discountAmount } = (0, calculation_1.calculateDiscountAmount)(itemMrpPrice, discountType, discount);
                    console.log('Calculated price:', price, 'Discount Amount:', discountAmount);
                    newInventory.price = price;
                    newInventory.discountAmount = discountAmount;
                    newInventory.discountType = discountType;
                }
                else {
                    newInventory.price = itemMrpPrice;
                }
                maxPrice = (newInventory === null || newInventory === void 0 ? void 0 : newInventory.price) && Math.min(maxPrice, newInventory === null || newInventory === void 0 ? void 0 : newInventory.price);
                const createdInventory = await inventory_repository_1.default.createNewInventory(newInventory);
                inventoryIds.push(createdInventory.id);
            }
        }
        else if (inventoryType === "levelInventory") {
            let inventoryTotal = 0;
            let newInventoryId = "";
            for (const item of inventoryArray) {
                const level = item.level || "Unknown";
                const quantity = Number(item.quantity) || 0;
                const itemMrpPrice = Number(item.mrpPrice);
                inventoryTotal += quantity;
                const title = "INV-";
                if (newInventoryId === "") {
                    newInventoryId = await (0, IdGenerator_1.idGenerate)(title, "inventoryID", prismadatabase_1.default.inventory);
                }
                else {
                    let id = Number(newInventoryId.slice(title.length + 6)) + 1;
                    let prefix = newInventoryId.slice(0, title.length + 6);
                    newInventoryId = prefix + id;
                }
                const newInventory = {
                    level: level,
                    barcode: item.barcode || (0, barcodeGenerate_1.generateEAN13Barcode)(),
                    quantity: quantity,
                    availableQuantity: quantity,
                    inventoryType: inventoryType,
                    inventoryID: newInventoryId,
                    mrpPrice: itemMrpPrice,
                };
                if (discountType && discount) {
                    // @ts-ignore
                    const { price, discountAmount } = (0, calculation_1.calculateDiscountAmount)(itemMrpPrice, discountType, discount);
                    console.log('Calculated price:', price, 'Discount Amount:', discountAmount);
                    newInventory.price = price;
                    newInventory.discountAmount = discountAmount;
                    newInventory.discountType = discountType;
                }
                else {
                    newInventory.price = itemMrpPrice;
                }
                console.log('New Inventory:', newInventory);
                maxPrice = (newInventory === null || newInventory === void 0 ? void 0 : newInventory.price) && Math.min(maxPrice, newInventory === null || newInventory === void 0 ? void 0 : newInventory.price);
                const createdInventory = await inventory_repository_1.default.createNewInventory(newInventory);
                inventoryIds.push(createdInventory.id);
            }
        }
        else if (inventoryType === "colorLevelInventory") {
            console.log('Creating color level inventory');
            let newInventoryID = "";
            for (const item of inventoryArray) {
                const level = item.level || "Unknown";
                const variants = item.colorLevel;
                const title = "INV-";
                // for (const variant of variants) {
                if (newInventoryID === "") {
                    newInventoryID = await (0, IdGenerator_1.idGenerate)(title, "inventoryID", prismadatabase_1.default.inventory);
                }
                else {
                    let id = Number(newInventoryID.slice(title.length + 6)) + 1;
                    let prefix = newInventoryID.slice(0, title.length + 6);
                    newInventoryID = prefix + id;
                }
                const newInventory = {
                    quantity: Number(item.quantity),
                    availableQuantity: Number(item.quantity),
                    color: item.colorCode || "#000000",
                    name: item.color || "Unknown",
                    level: level,
                    barcode: item.barcode || (0, barcodeGenerate_1.generateEAN13Barcode)(),
                    inventoryID: newInventoryID,
                    mrpPrice: Number(item.mrpPrice),
                    inventoryType: inventoryType,
                };
                if (discountType && discount) {
                    // @ts-ignore
                    const { price, discountAmount } = (0, calculation_1.calculateDiscountAmount)(Number(item.mrpPrice), discountType, discount);
                    newInventory.price = price;
                    newInventory.discountAmount = discountAmount;
                    newInventory.discountType = discountType;
                }
                else {
                    newInventory.price = Number(item.mrpPrice);
                }
                maxPrice = (newInventory === null || newInventory === void 0 ? void 0 : newInventory.price) && Math.min(maxPrice, newInventory === null || newInventory === void 0 ? void 0 : newInventory.price);
                const createdInventory = await inventory_repository_1.default.createNewInventory(newInventory);
                inventoryIds.push(createdInventory.id);
                // }
            }
        }
        else {
            payload.inventoryType = "inventory";
            const newInventoryID = await (0, IdGenerator_1.idGenerate)("INV-", "inventoryID", prismadatabase_1.default.inventory);
            const newInventory = {
                costPrice: Number(((_a = inventoryArray[0]) === null || _a === void 0 ? void 0 : _a.costPrice) || 0),
                quantity: Number(((_b = inventoryArray[0]) === null || _b === void 0 ? void 0 : _b.quantity) || 0),
                mrpPrice: Number(((_c = inventoryArray[0]) === null || _c === void 0 ? void 0 : _c.mrpPrice) || 0),
                barcode: ((_d = inventoryArray[0]) === null || _d === void 0 ? void 0 : _d.barcode) || (0, barcodeGenerate_1.generateEAN13Barcode)(),
                availableQuantity: Number(((_e = inventoryArray[0]) === null || _e === void 0 ? void 0 : _e.quantity) || 0),
                inventoryType: inventoryType,
                inventoryID: newInventoryID,
            };
            if (discountType && discount) {
                // @ts-ignore
                const { price, discountAmount } = (0, calculation_1.calculateDiscountAmount)(Number((_f = inventoryArray[0]) === null || _f === void 0 ? void 0 : _f.mrpPrice), discountType, discount);
                newInventory.price = price;
                newInventory.discountAmount = discountAmount;
                newInventory.discountType = discountType;
            }
            else {
                newInventory.price = Number((_g = inventoryArray[0]) === null || _g === void 0 ? void 0 : _g.mrpPrice);
            }
            maxPrice = newInventory === null || newInventory === void 0 ? void 0 : newInventory.price;
            const createdInventory = await inventory_repository_1.default.createNewInventory(newInventory);
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
        }
        else {
            delete payload.subCategoryRef;
        }
        if (!(files === null || files === void 0 ? void 0 : files.length)) {
            const error = new Error("Thumbnail Image is required");
            error.statusCode = 400;
            throw error;
        }
        const hasThumbnailImage = files.some((file) => file.fieldname === "thumbnailImage");
        if (!hasThumbnailImage) {
            const error = new Error("Thumbnail Image is required");
            error.statusCode = 400;
            throw error;
        }
        let images = await (0, ImgUploder_1.default)(files);
        for (const key in images) {
            payload[key] = images[key];
        }
        payload.productId = await (0, IdGenerator_1.idGenerate)("PRO-", "productId", prismadatabase_1.default.product);
        console.log("Payload before creating product:", payload.productId);
        payload.price = maxPrice;
        payload.slug = (0, slugGenerate_1.slugGenerate)(payload.name);
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
    async getAllBestSellProduct(payload) {
        const product = await this.repository.getAllBestSellProduct(payload);
        return product;
    }
    async getAllDiscountedProduct(payload) {
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
    async getRelatedProduct(payload) {
        return await this.repository.getRelatedProduct(payload);
    }
    //   async getSearchProduct(payload: any) {
    //     return await this.repository.getSearchProduct(payload);
    //   }
    async getProductWithPagination(payload) {
        return await this.repository.getProductWithPagination(payload);
    }
    async getProductWithPaginationForAdmin(payload) {
        return await this.repository.getProductWithPaginationForAdmin(payload);
    }
    async getProductViewCount(payload) {
        return await this.repository.getProductViewCount(payload);
    }
    async getNewArrivalsProductWithPagination(payload) {
        return await this.repository.getNewArrivalsProductWithPagination(payload);
    }
    async getTrendingProductsWithPagination(payload) {
        return await this.repository.getTrendingProductsWithPagination(payload);
    }
    async getComingSoonProductWithPagination(payload) {
        return await this.repository.getComingSoonProductWithPagination(payload);
    }
    async getSingleProduct(slug) {
        const productData = await this.repository.getSingleProduct(slug);
        if (!productData) {
            const error = new Error('Product Not Find');
            error.statusCode = 404;
            throw error;
        }
        return productData;
    }
    async updateProduct(slug, payloadFiles, payload, session) {
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
    async deleteProduct(slug, session) {
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
}
exports.ProductService = ProductService;
const productService = new ProductService(product_repository_1.default);
exports.default = productService;
