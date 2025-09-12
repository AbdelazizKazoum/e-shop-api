"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
const common_1 = require("@nestjs/common");
class AbstractRepository {
    constructor(entityRepository) {
        this.entityRepository = entityRepository;
    }
    async create(entity) {
        const newEntity = this.entityRepository.create(entity);
        return this.entityRepository.save(newEntity);
    }
    async findOne(where, options) {
        const entity = await this.entityRepository.findOne({ where, ...options });
        return entity;
    }
    async findOneOrDefault(where, options) {
        return this.entityRepository.findOne({ where, ...options });
    }
    async findAll(options) {
        return this.entityRepository.find(options);
    }
    async findOneAndUpdate(where, partialEntity) {
        const entity = await this.findOne(where);
        Object.assign(entity, partialEntity);
        return this.entityRepository.save(entity);
    }
    async findOneAndDelete(where) {
        const result = await this.entityRepository.delete(where);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Entity not found for deletion.');
        }
    }
    async findAndCountWithPagination(options) {
        return this.entityRepository.findAndCount(options);
    }
}
exports.AbstractRepository = AbstractRepository;
//# sourceMappingURL=abstract.repository.js.map