"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("./stratigies/jwt.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const jwt_constants_1 = require("../../shared/constants/jwt.constants");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const users_module_1 = require("../users/users.module");
const storage_module_1 = require("../storage/storage.module");
const r2_service_1 = require("../storage/r2.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                global: true,
                secret: jwt_constants_1.jwtConstants.jwtTokenSecret,
                signOptions: jwt_constants_1.jwtConstants.jwtExpirationTime
                    ? { expiresIn: jwt_constants_1.jwtConstants.jwtExpirationTime }
                    : undefined,
            }),
            users_module_1.UsersModule,
            storage_module_1.StorageModule,
        ],
        exports: [passport_1.PassportModule, jwt_1.JwtModule, jwt_auth_guard_1.JwtAuthGuard],
        controllers: [auth_controller_1.AuthController],
        providers: [jwt_strategy_1.JwtStrategy, jwt_auth_guard_1.JwtAuthGuard, auth_service_1.AuthService, r2_service_1.R2Service],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map