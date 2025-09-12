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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const common_1 = require("@nestjs/common");
const stock_service_1 = require("./stock.service");
const create_stock_dto_1 = require("./dto/create-stock.dto");
const update_stock_dto_1 = require("./dto/update-stock.dto");
const get_quantities_dto_1 = require("./dto/get-quantities.dto");
let StockController = class StockController {
    constructor(stockService) {
        this.stockService = stockService;
    }
    async create(createStockDto) {
        return this.stockService.create(createStockDto);
    }
    async findAll(page = 1, limit = 10, productName, minQte, maxQte, sortBy) {
        const filters = { productName, minQte, maxQte, sortBy };
        if (filters.minQte) {
            filters.minQte = Number(filters.minQte);
        }
        if (filters.maxQte) {
            filters.maxQte = Number(filters.maxQte);
        }
        return this.stockService.findAllWithFiltersAndPagination(page, limit, filters);
    }
    async getQuantitiesForVariants(getQuantitiesDto) {
        return this.stockService.getQuantitiesForVariants(getQuantitiesDto.variantIds);
    }
    async getQuantityByVariant(variantId) {
        const quantity = await this.stockService.getStockQuantityByVariant(variantId);
        return { variantId, quantity };
    }
    async findOne(id) {
        return this.stockService.findOne(id);
    }
    async update(id, updateStockDto) {
        return this.stockService.update(id, updateStockDto);
    }
    async remove(id) {
        return this.stockService.remove(id);
    }
};
exports.StockController = StockController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stock_dto_1.CreateStockDto]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('productName')),
    __param(3, (0, common_1.Query)('minQte')),
    __param(4, (0, common_1.Query)('maxQte')),
    __param(5, (0, common_1.Query)('sortBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('quantities-by-variants'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_quantities_dto_1.GetQuantitiesDto]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getQuantitiesForVariants", null);
__decorate([
    (0, common_1.Get)('variant/:variantId'),
    __param(0, (0, common_1.Param)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getQuantityByVariant", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_stock_dto_1.UpdateStockDto]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "remove", null);
exports.StockController = StockController = __decorate([
    (0, common_1.Controller)('stock'),
    __metadata("design:paramtypes", [stock_service_1.StockService])
], StockController);
//# sourceMappingURL=stock.controller.js.map