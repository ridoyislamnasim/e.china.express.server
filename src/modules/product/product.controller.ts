import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import ProductService from './product.service';
import e1688Service from './e1688.service';
import { ensureNullIfUndefined } from '../../utils/helpers';

class ProductController {
  // 1688 API Controllers
  get1688ProductDetails = catchError(async (req: Request, res: Response) => {
    const payload = {
      productId: req.params.productId,
    };
    const productResult = await ProductService.get1688ProductDetails(payload);
    console.log("productResult", productResult);
    const resDoc = responseHandler(200, 'Product Details Retrieved Successfully', productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  get1688Products = catchError(async (req: Request, res: Response) => {
    const payload = {
      q: typeof req.query.q === 'string' ? req.query.q : String(req.query.q ?? ''),
      page: typeof req.query.page === 'string' ? req.query.page : String(req.query.page ?? '1'),
      limit: typeof req.query.limit === 'string' ? req.query.limit : String(req.query.limit ?? '20'),
    };
    const result = await e1688Service.search1688Products(payload);
    const resDoc = responseHandler(200, '1688 Products retrieved successfully', result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  createProduct = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      name: req.body.name,
      description: req.body.description,
      gender: req.body.gender,
      costPrice: Number(req.body.costPrice),
      mrpPrice: Number(req.body.mrpPrice),
      discountType: ensureNullIfUndefined(req.body.discountType),
      discount: Number(req.body.discount),
      videoUrl: req.body.videoUrl,
      freeShipping: Boolean(req.body.freeShipping),
      brandRef: req.body.brandRef,
      categoryRef: Number(req.body.categoryRef),
      subCategoryRef: req.body.subCategoryRef ? Number(req.body.subCategoryRef) : undefined,
      // childCategoryRef: ensureNullIfUndefined(req.body.childCategoryRef),
      // subChildCategoryRef: ensureNullIfUndefined(req.body.subChildCategoryRef),
      inventoryType: req.body.inventoryType,
      inventoryArray: req?.body?.inventoryArray ? JSON.parse(req?.body?.inventoryArray) : [],
      slug: req.body.slug,
      barcode: req.body.barcode,
      publishStatus: req.body.publishStatus
    };
    console.log("Payload in updateProduct:", payload);
    const productResult = await ProductService.createProduct(payloadFiles, payload, tx);
    const resDoc = responseHandler(201, 'Product Created successfully', productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllProduct = catchError(async (req: Request, res: Response) => {
    const productResult = await ProductService.getAllProduct();
    const resDoc = responseHandler(200, 'Get All Products', productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllBestSellProduct = catchError(async (req: Request, res: Response) => {
    const payload = {
      limit: req.query.limit,
    };
    const productResult = await ProductService.getAllBestSellProduct(payload);
    const resDoc = responseHandler(200, 'Get All Best Selling Products', productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllDiscountedProduct = catchError(async (req: Request, res: Response) => {
    const payload = {
      limit: req.query.limit,
    };
    const productResult = await ProductService.getAllDiscountedProduct(payload);
    const resDoc = responseHandler(200, 'Get All Discounted Products', productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getShopOption = catchError(async (req: Request, res: Response) => {
    const productResult = await ProductService.getShopOption();
    const resDoc = responseHandler(200, "Get Shop Options", productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

//   getAllProductForHomePage = catchError(async (req: Request, res: Response) => {
//     const payload = {
//       limit: req.query.limit,
//       viewType: req.query.viewType,
//     };
//     const productResult = await ProductService.getAllProductForHomePage(payload);
//     const data = {
//       result: productResult?.product,
//       category: productResult?.subCategory,
//     };
//     const resDoc = responseHandler(200, 'Get All Products', data);
//     res.status(resDoc.statusCode).json(resDoc);
//   });

  getRelatedProduct = catchError(async (req: Request, res: Response) => {
    const payload = {
      slug: req.params.slug,
    };
    const productResult = await ProductService.getRelatedProduct(payload);
    const resDoc = responseHandler(200, 'Get All Products', productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // getSearchProduct = catchError(async (req: Request, res: Response) => {
  //   const payload = {
  //     search: req.query.search,
  //   };
  //   const productResult = await ProductService.getSearchProduct(payload);
  //   const resDoc = responseHandler(200, 'Get All Products', productResult);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  getProductWithPagination = catchError(async (req: Request, res: Response) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
      sortBy: req.query.sortBy,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      categoryId: req.query.categoryId,
      categorySlug: req.query.categorySlug,
      subCategoryId: req.query.subCategoryId,
      subCategorySlug: req.query.subCategorySlug,
      childCategoryId: req.query.childCategoryId,
      childCategorySlug: req.query.childCategorySlug,
      subChildCategoryId: req.query.subChildCategoryId,
      subChildCategorySlug: req.query.subChildCategorySlug,
      brandId: req.query.brandId,
      brandSlug: req.query.brandSlug,
      isNewArrival: req.query.isNewArrival,
      color: req.query.color,
      level: req.query.level,
      popular: req.query.popular,
      bestSell: req.query.bestSell,
      featured: req.query.featured,
      gender: req.query.gender,
    };
    const product = await ProductService.getProductWithPagination(payload);
    const resDoc = responseHandler(200, 'Products retrieved successfully', { ...product });
    res.status(resDoc.statusCode).json(resDoc);
  });

  getProductWithPaginationForAdmin = catchError(async (req: Request, res: Response) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
      warehouseRef: req.query.warehouseRef,
    };
    const product = await ProductService.getProductWithPaginationForAdmin(payload);
    // console.log("product", product);
    const resDoc = responseHandler(200, 'Products retrieved successfully', { ...product });
    res.status(resDoc.statusCode).json(resDoc);
  });

    getProductViewCount = catchError(async (req: Request, res: Response) => {
    let payload = {
      slug: req.params.slug,
    };
    const product = await ProductService.getProductViewCount(payload);
    const resDoc = responseHandler(200, 'Products view count successfully' );
    res.status(resDoc.statusCode).json(resDoc);
  });

    getNewArrivalsProductWithPagination = catchError(async (req: Request, res: Response) => {
    let payload = {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      order: req.query.order,
    };
    const product = await ProductService.getNewArrivalsProductWithPagination(payload);
    const resDoc = responseHandler(200, 'Products retrieved successfully', product );
    res.status(resDoc.statusCode).json(resDoc);
  });

      getTrendingProductsWithPagination = catchError(async (req: Request, res: Response) => {
    let payload = {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      order: req.query.order,
    };
    const product = await ProductService.getTrendingProductsWithPagination(payload);
    const resDoc = responseHandler(200, 'Products retrieved successfully', product );
    res.status(resDoc.statusCode).json(resDoc);
  });

      getComingSoonProductWithPagination = catchError(async (req: Request, res: Response) => {
    let payload = {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      order: req.query.order,
    };
    const product = await ProductService.getComingSoonProductWithPagination(payload);
    const resDoc = responseHandler(200, 'Products retrieved successfully', product );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleProduct = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const productResult = await ProductService.getSingleProduct(slug);
    const resDoc = responseHandler(201, 'Single Product successfully', productResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateProduct = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
    try {
      const slug = req.params.slug;
      const payloadFiles = {
        files: req?.files,
      };
      const payload = {
        name: req.body.name,
        description: req.body.description,
        gender: req.body.gender,
        warehousePrice: req.body.warehousePrice,
        warehouseProfit: req.body.warehouseProfit,
        wholesalePrice: req.body.wholesalePrice,
        wholesaleProfit: req.body.wholesaleProfit,
        mrpPrice: req.body.mrpPrice,
        discountType: ensureNullIfUndefined(req.body.discountType),
        discount: ensureNullIfUndefined(req.body.discount),
        videoUrl: req.body.videoUrl,
        freeShipping: req.body.freeShipping,
        brandRef: ensureNullIfUndefined(req.body.brandRef),
        categoryRef: ensureNullIfUndefined(req.body.categoryRef),
        subCategoryRef: req.body.subCategoryRef ? Number(req.body.subCategoryRef) : undefined,
        childCategoryRef: ensureNullIfUndefined(req.body.childCategoryRef),
        subChildCategoryRef: ensureNullIfUndefined(req.body.subChildCategoryRef),
        inventoryType: req.body.inventoryType,
        inventory: req?.body?.inventory,
        inventoryArray: req?.body?.inventoryArray ? JSON.parse(req?.body?.inventoryArray) : [],
        slug: req.body.slug,
        barcode: req.body.barcode,
      };

      
      await ProductService.updateProduct(slug, payloadFiles, payload, session);
      const resDoc = responseHandler(201, 'Product Update successfully');
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Product title already exists.' });
      }
      // console.log(error);
      next(error);
    }
  });

//   updateProductStatus = catchError(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const status = req.query.status;
//     await ProductService.updateProductStatus(id, status);
//     const resDoc = responseHandler(201, 'Product Status Update successfully');
//     res.status(resDoc.statusCode).json(resDoc);
//   });

  deleteProduct = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
    const slug = req.params.slug;
    await ProductService.deleteProduct(slug, session);
    const resDoc = responseHandler(200, 'Product Deleted successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new ProductController();
