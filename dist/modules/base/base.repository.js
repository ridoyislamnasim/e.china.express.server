"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
// BaseRepository for Mongoose models (TypeScript version)
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(item) {
        return await this.model.create({ data: item });
    }
    async findAll(where = {}, include = {}) {
        return await this.model.findMany({ where, include });
    }
    async findOne(where = {}, include = {}) {
        return await this.model.findFirst({ where, include });
    }
    async findOneByIdentifier(identifier) {
        // This method assumes identifier is a unique field name
        return await this.model.findFirst({ orderBy: { [identifier]: 'desc' }, select: { [identifier]: true } });
    }
    async findById(id, include = {}) {
        return await this.model.findUnique({ where: { id }, include });
    }
    async findBySlug(slug, include = {}) {
        return await this.model.findFirst({ where: { slug }, include });
    }
    async updateById(id, updatedData) {
        return await this.model.update({ where: { id }, data: updatedData });
    }
    async deleteById(id) {
        return await this.model.delete({ where: { id } });
    }
    async updateStatus(id, status) {
        return await this.model.update({ where: { id }, data: { status: status.status } });
    }
}
exports.BaseRepository = BaseRepository;
