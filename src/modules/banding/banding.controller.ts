import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import bandingService from './banding.service';

class BandingController {
  // Create a new banding
  createBanding = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payload = {
      brandingName: req.body.brandingName,
      image: req.body.image,
      material: req.body.material,
      width: req.body.width,
      thickness: req.body.thickness,
      length: req.body.length,
      strength: req.body.strength,
      tensileStrength: req.body.tensileStrength,
      color: req.body.color,
      brand: req.body.brand,
      logo: req.body.logo,
      type: req.body.type,
      category: req.body.category,
      packaging: req.body.packaging,
      price: req.body.price,
      priceCurrency: req.body.priceCurrency || 'USD',
      costPrice: req.body.costPrice,
      discountPercent: req.body.discountPercent,
      status: req.body.status || 'ACTIVE',
      createdBy: req.user?.id, // Assuming user info from auth middleware
    };
    
    const bandingResult = await bandingService.createBanding(payload);
    const resDoc = responseHandler(
      201,
      'Banding created successfully',
      bandingResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get all bandings with filters
  getAllBandings = catchError(async (req: Request, res: Response) => {
    const payload = {
      type: req.query.type as string,
      category: req.query.category as string,
      status: req.query.status as string,
      brand: req.query.brand as string,
      packaging: req.query.packaging as string,
      minPrice: req.query.minPrice as string,
      maxPrice: req.query.maxPrice as string,
      search: req.query.search as string,
    };
    const bandings = await bandingService.getAllBandings(payload);
    const resDoc = responseHandler(200, 'Get all bandings', bandings);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get bandings with pagination
  getBandingsWithPagination = catchError(async (req: Request, res: Response) => {
    const payload = {
      type: req.query.type as string,
      category: req.query.category as string,
      status: req.query.status as string,
      brand: req.query.brand as string,
      packaging: req.query.packaging as string,
      minPrice: req.query.minPrice as string,
      maxPrice: req.query.maxPrice as string,
      search: req.query.search as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      order: req.query.order as string || 'desc',
      sortBy: req.query.sortBy as string || 'createdAt',
    };
    const bandings = await bandingService.getBandingsWithPagination(payload);
    const resDoc = responseHandler(200, 'Bandings retrieved successfully', bandings);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get bandings by type
  getBandingsByType = catchError(async (req: Request, res: Response) => {
    const type = req.params.type;
    const payload = {
      type,
      status: req.query.status as string,
      category: req.query.category as string,
    };
    const bandings = await bandingService.getBandingsByType(payload);
    const resDoc = responseHandler(200, `Bandings of type ${type} retrieved`, bandings);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get bandings by category
  getBandingsByCategory = catchError(async (req: Request, res: Response) => {
    const category = req.params.category;
    const payload = {
      category,
      status: req.query.status as string,
      type: req.query.type as string,
    };
    const bandings = await bandingService.getBandingsByCategory(payload);
    const resDoc = responseHandler(200, `Bandings of category ${category} retrieved`, bandings);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get bandings by status
  getBandingsByStatus = catchError(async (req: Request, res: Response) => {
    const status = req.params.status;
    const payload = {
      status,
      type: req.query.type as string,
      category: req.query.category as string,
    };
    const bandings = await bandingService.getBandingsByStatus(payload);
    const resDoc = responseHandler(200, `Bandings with status ${status} retrieved`, bandings);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Search bandings
  searchBandings = catchError(async (req: Request, res: Response) => {
    const payload = {
      query: req.query.query as string,
      type: req.query.type as string,
      category: req.query.category as string,
      status: req.query.status as string,
      limit: Number(req.query.limit) || 20,
    };
    const bandings = await bandingService.searchBandings(payload);
    const resDoc = responseHandler(200, 'Search results retrieved', bandings);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get single banding by ID
  getSingleBanding = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const banding = await bandingService.getSingleBanding(id);
    const resDoc = responseHandler(
      200,
      'Banding retrieved successfully',
      banding
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get banding by slug
  getBandingBySlug = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const banding = await bandingService.getBandingBySlug(slug);
    const resDoc = responseHandler(
      200,
      'Banding retrieved successfully',
      banding
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Update banding (full update)
  updateBanding = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = {
      brandingName: req.body.brandingName,
      image: req.body.image,
      material: req.body.material,
      width: req.body.width,
      thickness: req.body.thickness,
      length: req.body.length,
      strength: req.body.strength,
      tensileStrength: req.body.tensileStrength,
      color: req.body.color,
      brand: req.body.brand,
      logo: req.body.logo,
      type: req.body.type,
      category: req.body.category,
      packaging: req.body.packaging,
      price: req.body.price,
      priceCurrency: req.body.priceCurrency,
      costPrice: req.body.costPrice,
      discountPercent: req.body.discountPercent,
      status: req.body.status,
      updatedBy: req.user?.id,
    };
    const banding = await bandingService.updateBanding(id, payload);
    const resDoc = responseHandler(
      200,
      'Banding updated successfully',
      banding
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Partial update banding
  partialUpdateBanding = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;
    if (req.user?.id) {
      payload.updatedBy = req.user.id;
    }
    const banding = await bandingService.partialUpdateBanding(id, payload);
    const resDoc = responseHandler(
      200,
      'Banding partially updated successfully',
      banding
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Update banding status
  updateBandingStatus = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const status = req.body.status;
    const updatedBy = req.user?.id;
    const banding = await bandingService.updateBandingStatus(id, status, updatedBy);
    const resDoc = responseHandler(
      200,
      'Banding status updated successfully',
      banding
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Update banding price
  updateBandingPrice = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = {
      price: req.body.price,
      costPrice: req.body.costPrice,
      discountPercent: req.body.discountPercent,
      priceCurrency: req.body.priceCurrency,
      updatedBy: req.user?.id,
    };
    const banding = await bandingService.updateBandingPrice(id, payload);
    const resDoc = responseHandler(
      200,
      'Banding price updated successfully',
      banding
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Delete banding
  deleteBanding = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    await bandingService.deleteBanding(id);
    const resDoc = responseHandler(200, 'Banding deleted successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new BandingController();