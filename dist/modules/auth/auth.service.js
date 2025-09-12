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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const jwt_constants_1 = require("../../shared/constants/jwt.constants");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingUser = await this.usersService
            .findByEmail(registerDto.email)
            .catch(() => null);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
            role: 'client',
            provider: 'local',
            created_at: new Date(),
        });
        return this.generateTokens(user);
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || user.provider !== 'local') {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateTokens(user);
    }
    async validateOAuthLogin(profile) {
        let user = await this.usersService
            .findByEmail(profile.email)
            .catch(() => null);
        if (!user) {
            user = await this.usersService.create({
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                image: profile.image,
                provider: profile.provider,
                providerId: profile.providerId,
                password: '',
                role: 'client',
                created_at: new Date(),
            });
        }
        return this.generateTokens(user);
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return null;
        if (user.provider !== 'local') {
            return user;
        }
        if (pass && (await bcrypt.compare(pass, user.password))) {
            return user;
        }
        return null;
    }
    generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            role: user.role,
            provider: user.provider,
        };
        const access_token = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refresh_token = this.jwtService.sign(payload, {
            secret: jwt_constants_1.jwtConstants.jwtRefreshTokenSecret,
            expiresIn: '7d',
        });
        return { data: payload, access_token, refresh_token };
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const user = await this.validateUser(decoded.email);
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            const payload = {
                sub: user.id,
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                role: user.role,
                provider: user.provider,
            };
            const access_token = this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            });
            const new_refresh_token = this.jwtService.sign(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            });
            return { data: payload, access_token, refresh_token: new_refresh_token };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map