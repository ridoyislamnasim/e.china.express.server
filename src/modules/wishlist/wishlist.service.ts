import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import wishListRepository from './wishlist.repository';

export class WishListService extends BaseService<any> {
  private repository: typeof wishListRepository;
  constructor(repository: typeof wishListRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createWishList(payload: any) {
        const {userRef,  productRef} = payload;
      if (!userRef || !productRef) {
        throw new NotFoundError('Missing required fields');
      }

    return await this.repository.createWishList(payload);
  }

  async getAllWishList(payload: any) {
    return await this.repository.getAllWishList(payload);
  }

  async getWishListWithPagination(payload: any) {
    return await this.repository.getWishListWithPagination(payload);
  }

  async getSingleWishList(id: string) {
    const wishListData = await this.repository.getSingleWishList( id );
    if (!wishListData) throw new NotFoundError('WishList Not Found');
    return wishListData;
  }


  async deleteWishList(id: string) {
    return await this.repository.deleteWishList(id);
  }

}

const wishListService = new WishListService(wishListRepository, 'wishList');
export default wishListService;
