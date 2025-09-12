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
exports.SupplyOrder = void 0;
const supplier_entity_1 = require("../../suppliers/entities/supplier.entity");
const typeorm_1 = require("typeorm");
const supplyOrderItem_entity_1 = require("./supplyOrderItem.entity");
let SupplyOrder = class SupplyOrder {
};
exports.SupplyOrder = SupplyOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SupplyOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, (supplier) => supplier.orders),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", supplier_entity_1.Supplier)
], SupplyOrder.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => supplyOrderItem_entity_1.SupplyOrderItem, (item) => item.order, { cascade: true }),
    __metadata("design:type", Array)
], SupplyOrder.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'approved', 'received', 'cancelled'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], SupplyOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SupplyOrder.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SupplyOrder.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SupplyOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SupplyOrder.prototype, "updatedAt", void 0);
exports.SupplyOrder = SupplyOrder = __decorate([
    (0, typeorm_1.Entity)()
], SupplyOrder);
//# sourceMappingURL=supply-order.entity.js.map