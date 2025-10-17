export class BaseService<T> {
  protected model: any;

  constructor(model: any) {
    this.model = model;
  }

  async create(data: T) {
    return await this.model.create({ data });
  }

  async findAll(where: object = {}, include: object = {}) {
    // console.log('Finding all with where:', this, this.model, where, 'and include:', include);
    return await this.model.findMany({ where, include });
  }

  async findOne(where: object = {}, include: object = {}) {
    return await this.model.findUnique({ where, include });
  }

  async updateById(id: string, data: Partial<T>) {
    return await this.model.update({ where: { id }, data });
  }

  async deleteById(id: string) {
    return await this.model.delete({ where: { id } });
  }
}

export default BaseService;
