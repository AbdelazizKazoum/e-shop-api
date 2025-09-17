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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const brand_repository_1 = require("./repositories/brand.repository");
const r2_service_1 = require("../storage/r2.service");
const uuid_1 = require("uuid");
const typeorm_1 = require("typeorm");
let BrandsService = class BrandsService {
    constructor(brandRepository, r2Service) {
        this.brandRepository = brandRepository;
        this.r2Service = r2Service;
    }
    async create(createBrandDto, image) {
        let imageUrl;
        let key;
        try {
            if (image) {
                key = `brands/${createBrandDto.name}-${(0, uuid_1.v4)()}.${image.mimetype.split('/')[1]}`;
                imageUrl = await this.r2Service.uploadFile(image, key);
            }
            const brand = await this.brandRepository.create({
                ...createBrandDto,
                imageUrl: imageUrl,
            });
            return brand;
        }
        catch (error) {
            if (imageUrl && key) {
                await this.r2Service.deleteFile(imageUrl);
            }
            throw new common_1.InternalServerErrorException('Failed to create brand');
        }
    }
    async findAll(page = 1, limit = 10, filter) {
        const skip = (page - 1) * limit;
        const where = filter
            ? [{ name: (0, typeorm_1.Like)(`%${filter}%`) }, { description: (0, typeorm_1.Like)(`%${filter}%`) }]
            : undefined;
        const [data, total] = await this.brandRepository.findAndCountWithPagination({
            where,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, total, page, limit };
    }
    async findOne(id) {
        const brand = await this.brandRepository.findOne({ id });
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with id ${id} not found`);
        }
        return brand;
    }
    async update(id, updateBrandDto, image) {
        let imageUrl;
        try {
            const brand = await this.brandRepository.findOne({ id });
            if (!brand) {
                throw new common_1.NotFoundException(`Brand with id ${id} not found`);
            }
            if (image) {
                if (brand.imageUrl) {
                    await this.r2Service.deleteFile(brand.imageUrl);
                }
                const key = `brands/main/${Date.now()}-${image.originalname}`;
                imageUrl = await this.r2Service.uploadFile(image, key);
            }
            return this.brandRepository.findOneAndUpdate({ id }, { ...updateBrandDto, imageUrl: imageUrl ?? brand.imageUrl });
        }
        catch (error) {
            if (imageUrl) {
                await this.r2Service.deleteFile(imageUrl);
            }
            throw new common_1.InternalServerErrorException('Failed to update brand');
        }
    }
    async remove(id) {
        const brand = await this.brandRepository.findOne({ id });
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with id ${id} not found`);
        }
        if (brand.imageUrl) {
            await this.r2Service.deleteFile(brand.imageUrl);
        }
        await this.brandRepository.findOneAndDelete({ id });
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [brand_repository_1.BrandRepository,
        r2_service_1.R2Service])
], BrandsService);
//# sourceMappingURL=brands.service.js.map