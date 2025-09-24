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
exports.StockMovementsController = void 0;
const common_1 = require("@nestjs/common");
const stock_movements_service_1 = require("./stock-movements.service");
const create_stock_movement_dto_1 = require("./dto/create-stock-movement.dto");
const update_stock_movement_dto_1 = require("./dto/update-stock-movement.dto");
let StockMovementsController = class StockMovementsController {
    constructor(stockMovementsService) {
        this.stockMovementsService = stockMovementsService;
    }
    async create(createStockMovementDto) {
        return this.stockMovementsService.create(createStockMovementDto);
    }
    async findAll(page, limit, type, reason, variantId, supplierId, userId, startDate, endDate) {
        return this.stockMovementsService.findAll({
            page,
            limit,
            type,
            reason,
            variantId,
            supplierId,
            userId,
            startDate,
            endDate,
        });
    }
    async findOne(id) {
        return this.stockMovementsService.findOne(id);
    }
    async update(id, updateStockMovementDto) {
        return this.stockMovementsService.update(id, updateStockMovementDto);
    }
    async remove(id) {
        return this.stockMovementsService.remove(id);
    }
};
exports.StockMovementsController = StockMovementsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stock_movement_dto_1.CreateStockMovementDto]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('reason')),
    __param(4, (0, common_1.Query)('variantId')),
    __param(5, (0, common_1.Query)('supplierId')),
    __param(6, (0, common_1.Query)('userId')),
    __param(7, (0, common_1.Query)('startDate')),
    __param(8, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_stock_movement_dto_1.UpdateStockMovementDto]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "remove", null);
exports.StockMovementsController = StockMovementsController = __decorate([
    (0, common_1.Controller)('stock-movements'),
    __metadata("design:paramtypes", [stock_movements_service_1.StockMovementsService])
], StockMovementsController);
//# sourceMappingURL=stock-movements.controller.js.map