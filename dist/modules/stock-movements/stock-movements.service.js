"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementsService = void 0;
const common_1 = require("@nestjs/common");
const stock_movement_repository_1 = require("./repositories/stock-movement.repository");
let StockMovementsService = class StockMovementsService {
    constructor(stockMovementRepository) {
        this.stockMovementRepository = stockMovementRepository;
    }
    async create(createStockMovementDto) {
        return this.stockMovementRepository.create({
            ...createStockMovementDto,
            productDetail: { id: createStockMovementDto.variantId },
            supplier: createStockMovementDto.supplierId
                ? { id: createStockMovementDto.supplierId }
                : null,
            supplierOrder: createStockMovementDto.supplierOrderId
                ? { id: createStockMovementDto.supplierOrderId }
                : null,
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, type, reason, variantId, supplierId, userId, startDate, endDate, } = query;
        const where = {};
        if (type)
            where.type = type;
        if (reason)
            where.reason = reason;
        if (variantId)
            where.productDetail = { id: variantId };
        if (supplierId)
            where.supplier = { id: supplierId };
        if (userId)
            where.user = { id: userId };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt['$gte'] = new Date(startDate);
            if (endDate)
                where.createdAt['$lte'] = new Date(endDate);
        }
        const [data, total] = await this.stockMovementRepository.findAndCountWithPagination({
            where,
            relations: ['productDetail', 'supplier', 'supplierOrder', 'user'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data,
            total,
            page: Number(page),
            limit: Number(limit),
        };
    }
    async findOne(id) {
        const movement = await this.stockMovementRepository.findOne({ id }, { relations: ['productDetail', 'supplier', 'supplierOrder', 'user'] });
        if (!movement)
            throw new common_1.NotFoundException('Stock movement not found');
        return movement;
    }
    async update(id, updateStockMovementDto) {
        const movement = await this.stockMovementRepository.findOne({ id });
        if (!movement)
            throw new common_1.NotFoundException('Stock movement not found');
        return this.stockMovementRepository.findOneAndUpdate({ id }, updateStockMovementDto);
    }
    async remove(id) {
        await this.stockMovementRepository.findOneAndDelete({ id });
        return { message: 'Stock movement deleted successfully' };
    }
};
exports.StockMovementsService = StockMovementsService;
exports.StockMovementsService = StockMovementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stock_movement_repository_1.StockMovementRepository])
], StockMovementsService);
//# sourceMappingURL=stock-movements.service.js.map