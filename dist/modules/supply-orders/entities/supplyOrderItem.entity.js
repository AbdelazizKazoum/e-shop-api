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
exports.SupplyOrderItem = void 0;
const variant_entity_1 = require("../../products/entities/variant.entity");
const typeorm_1 = require("typeorm");
const supply_order_entity_1 = require("./supply-order.entity");
let SupplyOrderItem = class SupplyOrderItem {
};
exports.SupplyOrderItem = SupplyOrderItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SupplyOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supply_order_entity_1.SupplyOrder, (order) => order.items, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", supply_order_entity_1.SupplyOrder)
], SupplyOrderItem.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => variant_entity_1.Variant, (detail) => detail.orderItems, {
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'detailProductId' }),
    __metadata("design:type", variant_entity_1.Variant)
], SupplyOrderItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SupplyOrderItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SupplyOrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SupplyOrderItem.prototype, "subTotal", void 0);
exports.SupplyOrderItem = SupplyOrderItem = __decorate([
    (0, typeorm_1.Entity)()
], SupplyOrderItem);
//# sourceMappingURL=supplyOrderItem.entity.js.map