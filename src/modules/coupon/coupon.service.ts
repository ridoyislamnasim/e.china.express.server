import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import couponRepository from './coupon.repository';

export class CouponService extends BaseService<any> {
  private repository: typeof couponRepository;
  constructor(repository: typeof couponRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createCoupon(payload: any) {
        const {code,  discount,useLimit,
      used,startDate,
      expireDate,discountType,
      categoryRef,subCategoryRef,brandRef} = payload;
      if (!code || !discount || !startDate || !expireDate) {
        throw new NotFoundError('Missing required fields');
      }
      if(discountType == "brand"){
        payload.brandRef = { connect: { id: Number(brandRef) } };
      }else if(discountType == "category"){
        payload.categoryRef = { connect: { id: Number(categoryRef) } };
      }else if(discountType == "subCategory"){
        payload.subCategoryRef = { connect: { id: Number(subCategoryRef) } };
      }
    return await this.repository.createCoupon(payload);
  }

  async getAllCoupon() {
    return await this.repository.getCouponWithPagination({});
  }

  async getCouponWithPagination(payload: any) {
    return await this.repository.getCouponWithPagination(payload);
  }

  async getSingleCoupon(id: string) {
    const couponData = await this.repository.getCouponWithPagination({ id });
    if (!couponData) throw new NotFoundError('Coupon Not Found');
    return couponData;
  }

  async updateCoupon(id: string, payload: any) {
    const {code,  discount,useLimit,
      used,startDate,
      expireDate,discountType,
      categoryRef,subCategoryRef,brandRef} = payload;
      if (!code || !discount || !startDate || !expireDate) {
        throw new NotFoundError('Missing required fields');
      }
      if(discountType == "brand"){
        payload.brandRef = { connect: { id: Number(brandRef) } };
      }else if(discountType == "category"){
        payload.categoryRef = { connect: { id: categoryRef} };
      }else if(discountType == "subCategory"){
        payload.subCategoryRef = { connect: { id: Number(subCategoryRef) } };
      }
    return await this.repository.updateCoupon(id, payload);
  }

  async updateCouponStatus(id: string, status: boolean) {
    if (status === undefined || status === null)
      throw new NotFoundError('Status is required');
    return await this.repository.updateCoupon(id, { status });
  }

  async deleteCoupon(id: string) {
    const coupon = await this.repository.getCouponWithPagination({ id });
    if (!coupon) throw new NotFoundError('Coupon not found');
    return await this.repository.updateCoupon(id, { deleted: true });
  }

  async calculateCouponTotal(payload: any) {
    return await this.repository.calculateCouponTotal(payload);
  }
}

const couponService = new CouponService(couponRepository, 'coupon');
export default couponService;
