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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./repositories/user.repository");
const typeorm_1 = require("typeorm");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        try {
            const user = await this.userRepository.create({
                ...createUserDto,
                created_at: new Date(),
            });
            return user;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to create user: ${error.message}`);
        }
    }
    async findAll(page = 1, limit = 10, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.email)
            where.email = (0, typeorm_1.ILike)(`%${filters.email}%`);
        if (filters?.username)
            where.username = (0, typeorm_1.ILike)(`%${filters.username}%`);
        if (filters?.status)
            where.status = filters.status;
        if (filters?.role)
            where.role = filters.role;
        if (filters?.provider)
            where.provider = filters.provider;
        if (filters?.firstName)
            where.firstName = (0, typeorm_1.ILike)(`%${filters.firstName}%`);
        if (filters?.lastName)
            where.lastName = (0, typeorm_1.ILike)(`%${filters.lastName}%`);
        const options = {
            where,
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        };
        const [data, total] = await this.userRepository.findAndCountWithPagination(options);
        return { data, total, page, limit };
    }
    async findOne(id, relations = []) {
        const user = await this.userRepository.findOne({
            id,
        }, { relations });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
    async findByEmail(email, relations = []) {
        const user = await this.userRepository.findOne({
            email,
        }, { relations });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        try {
            const existingUser = await this.userRepository.findOne({ id });
            if (!existingUser) {
                throw new common_1.NotFoundException(`User with id ${id} not found`);
            }
            const user = await this.userRepository.findOneAndUpdate({ id }, updateUserDto);
            return user;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to update user with id ${id}: ${error.message}`);
        }
    }
    async remove(id) {
        await this.userRepository.findOneAndDelete({ id });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map