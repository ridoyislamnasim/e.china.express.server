"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return await this.model.create({ data });
    }
    async findAll(where = {}, include = {}) {
        // console.log('Finding all with where:', this, this.model, where, 'and include:', include);
        return await this.model.findMany({ where, include });
    }
    async findOne(where = {}, include = {}) {
        return await this.model.findUnique({ where, include });
    }
    async updateById(id, data) {
        return await this.model.update({ where: { id }, data });
    }
    async deleteById(id) {
        return await this.model.delete({ where: { id } });
    }
}
exports.BaseService = BaseService;
exports.default = BaseService;
