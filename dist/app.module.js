"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_module_1 = require("./core/core.module");
const shared_module_1 = require("./shared/shared.module");
const auth_module_1 = require("./modules/auth/auth.module");
const products_module_1 = require("./modules/products/products.module");
const orders_module_1 = require("./modules/orders/orders.module");
const users_module_1 = require("./modules/users/users.module");
const stock_movements_module_1 = require("./modules/stock-movements/stock-movements.module");
const suppliers_module_1 = require("./modules/suppliers/suppliers.module");
const supply_orders_module_1 = require("./modules/supply-orders/supply-orders.module");
const storage_module_1 = require("./modules/storage/storage.module");
const stock_module_1 = require("./modules/stock/stock.module");
const brands_module_1 = require("./modules/brands/brands.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            core_module_1.CoreModule,
            shared_module_1.SharedModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            users_module_1.UsersModule,
            stock_movements_module_1.StockMovementsModule,
            suppliers_module_1.SuppliersModule,
            supply_orders_module_1.SupplyOrdersModule,
            storage_module_1.StorageModule,
            stock_module_1.StockModule,
            brands_module_1.BrandsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map