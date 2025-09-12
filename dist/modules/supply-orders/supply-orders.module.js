"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const supply_orders_service_1 = require("./supply-orders.service");
const supply_orders_controller_1 = require("./supply-orders.controller");
const database_module_1 = require("../../core/database/database.module");
const supply_order_entity_1 = require("./entities/supply-order.entity");
const supplyOrderItem_entity_1 = require("./entities/supplyOrderItem.entity");
const supplier_entity_1 = require("../suppliers/entities/supplier.entity");
let SupplyOrdersModule = class SupplyOrdersModule {
};
exports.SupplyOrdersModule = SupplyOrdersModule;
exports.SupplyOrdersModule = SupplyOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule.forFeature([supply_order_entity_1.SupplyOrder, supplyOrderItem_entity_1.SupplyOrderItem, supplier_entity_1.Supplier]),
        ],
        controllers: [supply_orders_controller_1.SupplyOrdersController],
        providers: [supply_orders_service_1.SupplyOrdersService],
    })
], SupplyOrdersModule);
//# sourceMappingURL=supply-orders.module.js.map