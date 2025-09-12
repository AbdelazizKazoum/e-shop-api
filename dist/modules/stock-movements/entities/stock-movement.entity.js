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
exports.StockMovement = void 0;
const typeorm_1 = require("typeorm");
const variant_entity_1 = require("../../products/entities/variant.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const supplier_entity_1 = require("../../suppliers/entities/supplier.entity");
const supply_order_entity_1 = require("../../supply-orders/entities/supply-order.entity");
const stock_movement_type_enum_1 = require("../types/stock-movement-type.enum");
let StockMovement = class StockMovement {
};
exports.StockMovement = StockMovement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StockMovement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => variant_entity_1.Variant, (variant) => variant.movements, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", variant_entity_1.Variant)
], StockMovement.prototype, "productDetail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: stock_movement_type_enum_1.StockMovementType }),
    __metadata("design:type", String)
], StockMovement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: stock_movement_type_enum_1.StockMovementReason,
        default: stock_movement_type_enum_1.StockMovementReason.MANUAL_ADJUSTMENT,
    }),
    __metadata("design:type", String)
], StockMovement.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, (supplier) => supplier.stockMovements, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", supplier_entity_1.Supplier)
], StockMovement.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supply_order_entity_1.SupplyOrder, { nullable: true }),
    __metadata("design:type", supply_order_entity_1.SupplyOrder)
], StockMovement.prototype, "supplierOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], StockMovement.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StockMovement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StockMovement.prototype, "updatedAt", void 0);
exports.StockMovement = StockMovement = __decorate([
    (0, typeorm_1.Entity)()
], StockMovement);
//# sourceMappingURL=stock-movement.entity.js.map