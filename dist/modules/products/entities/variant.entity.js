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
exports.Variant = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const stock_movement_entity_1 = require("../../stock-movements/entities/stock-movement.entity");
const supplyOrderItem_entity_1 = require("../../supply-orders/entities/supplyOrderItem.entity");
const stock_entity_1 = require("../../stock/entities/stock.entity");
const image_entity_1 = require("./image.entity");
let Variant = class Variant {
};
exports.Variant = Variant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Variant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Variant.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Variant.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Variant.prototype, "qte", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (prod) => prod.variants, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", product_entity_1.Product)
], Variant.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => image_entity_1.Image, (img) => img.variant, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], Variant.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_movement_entity_1.StockMovement, (movement) => movement.productDetail),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Variant.prototype, "movements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => supplyOrderItem_entity_1.SupplyOrderItem, (orderItem) => orderItem.variant),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Variant.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => stock_entity_1.Stock, (stock) => stock.variant, { cascade: true }),
    __metadata("design:type", stock_entity_1.Stock)
], Variant.prototype, "stock", void 0);
exports.Variant = Variant = __decorate([
    (0, typeorm_1.Entity)()
], Variant);
//# sourceMappingURL=variant.entity.js.map