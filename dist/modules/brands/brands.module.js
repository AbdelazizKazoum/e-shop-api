"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandsModule = void 0;
const common_1 = require("@nestjs/common");
const brands_service_1 = require("./brands.service");
const brands_controller_1 = require("./brands.controller");
const brand_repository_1 = require("./repositories/brand.repository");
const database_module_1 = require("../../core/database/database.module");
const brand_entity_1 = require("./entities/brand.entity");
const storage_module_1 = require("../storage/storage.module");
const r2_service_1 = require("../storage/r2.service");
let BrandsModule = class BrandsModule {
};
exports.BrandsModule = BrandsModule;
exports.BrandsModule = BrandsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([brand_entity_1.Brand]), storage_module_1.StorageModule],
        controllers: [brands_controller_1.BrandsController],
        providers: [brands_service_1.BrandsService, brand_repository_1.BrandRepository, r2_service_1.R2Service],
        exports: [brands_service_1.BrandsService],
    })
], BrandsModule);
//# sourceMappingURL=brands.module.js.map