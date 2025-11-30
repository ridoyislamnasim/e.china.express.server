import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import couponRepository from './coupon.repository';

export class CouponService extends BaseService<any> {
  private repository: typeof couponRepository;
  constructor(repository: typeof couponRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

}

const couponService = new CouponService(couponRepository, 'coupon');
export default couponService;
