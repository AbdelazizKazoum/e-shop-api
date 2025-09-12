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
exports.Stock = void 0;
const typeorm_1 = require("typeorm");
const variant_entity_1 = require("../../products/entities/variant.entity");
let Stock = class Stock {
};
exports.Stock = Stock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Stock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => variant_entity_1.Variant, (detail) => detail.stock),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", variant_entity_1.Variant)
], Stock.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Stock.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: new Date().toLocaleDateString() }),
    __metadata("design:type", String)
], Stock.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: new Date().toLocaleDateString() }),
    __metadata("design:type", String)
], Stock.prototype, "updated", void 0);
exports.Stock = Stock = __decorate([
    (0, typeorm_1.Entity)()
], Stock);
//# sourceMappingURL=stock.entity.js.map