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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const stock_repository_1 = require("./repositories/stock.repository");
const stock_entity_1 = require("./entities/stock.entity");
const typeorm_1 = require("typeorm");
let StockService = class StockService {
    constructor(stockRepository) {
        this.stockRepository = stockRepository;
    }
    async create(createStockDto) {
        return this.stockRepository.create({
            ...createStockDto,
            createAt: new Date().toLocaleDateString(),
            updated: new Date().toLocaleDateString(),
        });
    }
    async decreaseStockForVariant(variantId, quantityToDecrease, manager) {
        const stock = await manager.findOne(stock_entity_1.Stock, {
            where: { variant: { id: variantId } },
            relations: ['variant'],
        });
        if (!stock) {
            throw new common_1.NotFoundException(`Stock for variant with ID "${variantId}" not found.`);
        }
        if (stock.quantity < quantityToDecrease) {
            throw new common_1.BadRequestException(`Insufficient stock for variant "${stock.variant.id}". Available: ${stock.quantity}, Requested: ${quantityToDecrease}`);
        }
        stock.quantity -= quantityToDecrease;
        stock.updated = new Date().toISOString();
        return manager.save(stock);
    }
    async findAllWithFiltersAndPagination(page = 1, limit = 10, filters) {
        const { productName, minQte, maxQte, sortBy } = filters;
        const where = {};
        if (productName) {
            where.variant = { product: { name: (0, typeorm_1.Like)(`%${productName}%`) } };
        }
        if (minQte && maxQte) {
            where.quantity = (0, typeorm_1.Between)(minQte, maxQte);
        }
        else if (minQte) {
            where.quantity = (0, typeorm_1.Between)(minQte, 10000);
        }
        else if (maxQte) {
            where.quantity = (0, typeorm_1.Between)(0, maxQte);
        }
        const order = {};
        if (sortBy === 'newest') {
            order.createAt = 'DESC';
        }
        else if (sortBy === 'oldest') {
            order.createAt = 'ASC';
        }
        const [data, total] = await this.stockRepository.findAndCountWithPagination({
            where,
            order,
            take: limit,
            skip: (page - 1) * limit,
            relations: ['variant', 'variant.product'],
        });
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async findAll() {
        return this.stockRepository.findAll();
    }
    async findOne(id) {
        const stock = await this.stockRepository.findOne({ id });
        if (!stock) {
            throw new common_1.NotFoundException(`Stock with id "${id}" not found`);
        }
        return stock;
    }
    async getStockQuantityByVariant(variantId) {
        const stock = await this.stockRepository.findOne({
            variant: { id: variantId },
        });
        if (!stock) {
            throw new common_1.NotFoundException(`Stock information for variant with ID "${variantId}" not found.`);
        }
        return stock.quantity;
    }
    async getQuantitiesForVariants(variantIds) {
        if (!variantIds || variantIds.length === 0) {
            return {};
        }
        const stocks = await this.stockRepository.findAll({
            where: {
                variant: {
                    id: (0, typeorm_1.In)(variantIds),
                },
            },
            relations: ['variant'],
        });
        const quantityMap = {};
        variantIds.forEach((id) => {
            quantityMap[id] = 0;
        });
        stocks.forEach((stock) => {
            if (stock.variant && stock.variant.id) {
                quantityMap[stock.variant.id] = stock.quantity;
            }
        });
        return quantityMap;
    }
    async update(id, updateStockDto) {
        return this.stockRepository.findOneAndUpdate({ id }, { ...updateStockDto, updated: new Date().toLocaleDateString() });
    }
    async remove(id) {
        return this.stockRepository.findOneAndDelete({ id });
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stock_repository_1.StockRepository])
], StockService);
//# sourceMappingURL=stock.service.js.map