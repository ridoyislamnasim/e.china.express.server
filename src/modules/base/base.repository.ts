// BaseRepository for Mongoose models (TypeScript version)
export class BaseRepository<T extends { [key: string]: any }> {
  private model: any;
  constructor(model: any) {
    this.model = model;
  }


  async create(item: T) {
    return await this.model.create({ data: item });
  }

  async findAll(where: object = {}, include: object = {}) {
    return await this.model.findMany({ where, include });
  }

  async findOne(where: object = {}, include: object = {}) {
    return await this.model.findFirst({ where, include });
  }

  async findOneByIdentifier(identifier: string): Promise<any> {
    // This method assumes identifier is a unique field name
    return await this.model.findFirst({ orderBy: { [identifier]: 'desc' }, select: { [identifier]: true } });
  }

  async getSingleCart(id: number) {
    return await this.model.findUnique({ where: { id } });
  }

  async findBySlug(slug: string, include: object = {}) {
    return await this.model.findFirst({ where: { slug }, include });
  }

  async updateById(id: string, updatedData: Partial<T>) {
    return await this.model.update({ where: { id }, data: updatedData });
  }

  async deleteById(id: string) {
    return await this.model.delete({ where: { id } });
  }

  async updateStatus(id: string, status: { status: any }) {
    return await this.model.update({ where: { id }, data: { status: status.status } });
  }
}
