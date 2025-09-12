"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const product_entity_1 = require("./entities/product.entity");
const category_entity_1 = require("./entities/category.entity");
const variant_entity_1 = require("./entities/variant.entity");
const review_entity_1 = require("./entities/review.entity");
const database_module_1 = require("../../core/database/database.module");
const image_entity_1 = require("./entities/image.entity");
const product_repository_1 = require("./repositories/product.repository");
const category_repository_1 = require("./repositories/category.repository");
const storage_module_1 = require("../storage/storage.module");
const r2_service_1 = require("../storage/r2.service");
const variant_repository_1 = require("./repositories/variant.repository");
const image_repository_1 = require("./repositories/image.repository");
const stock_module_1 = require("../stock/stock.module");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule.forFeature([product_entity_1.Product, category_entity_1.Category, variant_entity_1.Variant, image_entity_1.Image, review_entity_1.Review]),
            storage_module_1.StorageModule,
            stock_module_1.StockModule,
        ],
        controllers: [products_controller_1.ProductsController],
        providers: [
            products_service_1.ProductsService,
            product_repository_1.ProductRepository,
            variant_repository_1.VariantRepository,
            image_repository_1.ImageRepository,
            category_repository_1.CategoryRepository,
            r2_service_1.R2Service,
        ],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map