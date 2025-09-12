"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const database_module_1 = require("../../core/database/database.module");
const user_entity_1 = require("./entities/user.entity");
const address_entity_1 = require("./entities/address.entity");
const user_repository_1 = require("./repositories/user.repository");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule.forFeature([user_entity_1.User, address_entity_1.Address])],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, user_repository_1.UserRepository],
        exports: [users_service_1.UsersService, user_repository_1.UserRepository],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map