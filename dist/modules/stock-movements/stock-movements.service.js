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
const typeorm_1 = require("typeorm");
const stock_movement_type_enum_1 = require("./types/stock-movement-type.enum");
const stock_entity_1 = require("../stock/entities/stock.entity");
const stock_movement_entity_1 = require("./entities/stock-movement.entity");
let StockMovementsService = class StockMovementsService {
    constructor(stockMovementRepository, dataSource) {
        this.stockMovementRepository = stockMovementRepository;
        this.dataSource = dataSource;
    }
    async create(createStockMovementDto) {
        const { variantId, type, quantity } = createStockMovementDto;
        return this.dataSource.transaction(async (manager) => {
            const stock = await manager.findOne(stock_entity_1.Stock, {
                where: { variant: { id: variantId } },
            });
            if (!stock) {
                throw new common_1.NotFoundException(`Stock for variant with ID "${variantId}" not found.`);
            }
            switch (type) {
                case stock_movement_type_enum_1.StockMovementType.ADD:
                    stock.quantity += quantity;
                    break;
                case stock_movement_type_enum_1.StockMovementType.REMOVE:
                    if (stock.quantity < quantity) {
                        throw new common_1.BadRequestException(`Insufficient stock. Available: ${stock.quantity}, Requested to remove: ${quantity}`);
                    }
                    stock.quantity -= quantity;
                    break;
                case stock_movement_type_enum_1.StockMovementType.CORRECTION:
                    stock.quantity = quantity;
                    break;
                default:
                    throw new common_1.BadRequestException(`Invalid stock movement type: ${type}`);
            }
            await manager.save(stock);
            const movement = manager.create(stock_movement_entity_1.StockMovement, {
                ...createStockMovementDto,
                productDetail: { id: createStockMovementDto.variantId },
                supplier: createStockMovementDto.supplierId
                    ? { id: createStockMovementDto.supplierId }
                    : null,
                supplierOrder: createStockMovementDto.supplierOrderId
                    ? { id: createStockMovementDto.supplierOrderId }
                    : null,
            });
            return manager.save(movement);
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
            relations: [
                'productDetail',
                'supplier',
                'supplierOrder',
                'user',
                'productDetail.product',
            ],
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
    __metadata("design:paramtypes", [stock_movement_repository_1.StockMovementRepository,
        typeorm_1.DataSource])
], StockMovementsService);
//# sourceMappingURL=stock-movements.service.js.map