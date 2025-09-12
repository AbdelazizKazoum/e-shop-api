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
var StockRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const abstract_repository_1 = require("../../../core/database/abstract.repository");
const typeorm_2 = require("typeorm");
const stock_entity_1 = require("../entities/stock.entity");
let StockRepository = StockRepository_1 = class StockRepository extends abstract_repository_1.AbstractRepository {
    constructor(stockRepository) {
        super(stockRepository);
        this.stockRepository = stockRepository;
        this.logger = new common_1.Logger(StockRepository_1.name);
    }
};
exports.StockRepository = StockRepository;
exports.StockRepository = StockRepository = StockRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StockRepository);
//# sourceMappingURL=stock.repository.js.map