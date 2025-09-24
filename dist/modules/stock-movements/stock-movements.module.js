"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementsModule = void 0;
const common_1 = require("@nestjs/common");
const stock_movements_service_1 = require("./stock-movements.service");
const stock_movements_controller_1 = require("./stock-movements.controller");
const stock_movement_entity_1 = require("./entities/stock-movement.entity");
const stock_entity_1 = require("../stock/entities/stock.entity");
const variant_entity_1 = require("../products/entities/variant.entity");
const database_module_1 = require("../../core/database/database.module");
const stock_movement_repository_1 = require("./repositories/stock-movement.repository");
let StockMovementsModule = class StockMovementsModule {
};
exports.StockMovementsModule = StockMovementsModule;
exports.StockMovementsModule = StockMovementsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([stock_movement_entity_1.StockMovement, stock_entity_1.Stock, variant_entity_1.Variant])],
        controllers: [stock_movements_controller_1.StockMovementsController],
        providers: [stock_movements_service_1.StockMovementsService, stock_movement_repository_1.StockMovementRepository],
    })
], StockMovementsModule);
//# sourceMappingURL=stock-movements.module.js.map