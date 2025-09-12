"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const order_entity_1 = require("./entities/order.entity");
const payment_entity_1 = require("./entities/payment.entity");
const orderItem_entity_1 = require("./entities/orderItem.entity");
const database_module_1 = require("../../core/database/database.module");
const order_repository_1 = require("./repositories/order.repository");
const jwt_constants_1 = require("../../shared/constants/jwt.constants");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const jwt_strategy_1 = require("../auth/stratigies/jwt.strategy");
const stock_module_1 = require("../stock/stock.module");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule.forFeature([order_entity_1.Order, orderItem_entity_1.OrderItem, payment_entity_1.Payment]),
            jwt_1.JwtModule.register({
                global: true,
                secret: jwt_constants_1.jwtConstants.jwtTokenSecret,
                signOptions: jwt_constants_1.jwtConstants.jwtExpirationTime
                    ? { expiresIn: jwt_constants_1.jwtConstants.jwtExpirationTime }
                    : undefined,
            }),
            stock_module_1.StockModule,
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService, order_repository_1.OrderRepository, jwt_auth_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map