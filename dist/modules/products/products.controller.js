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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const products_service_1 = require("./products.service");
const multer_1 = require("multer");
const r2_service_1 = require("../storage/r2.service");
let ProductsController = class ProductsController {
    constructor(productsService, r2Service) {
        this.productsService = productsService;
        this.r2Service = r2Service;
    }
    async create(data, image) {
        const createProductDto = JSON.parse(data);
        let imagePath = null;
        if (image) {
            const key = `products/main/${Date.now()}-${image.originalname}`;
            imagePath = await this.r2Service.uploadFile(image, key);
        }
        const product = await this.productsService.create(createProductDto, imagePath);
        return product;
    }
    async createVariants(productId, variantsData, files) {
        console.log('🚀 ~ ProductsController ~ createVariants ~ files:', files);
        const variants = JSON.parse(variantsData);
        console.log('🚀 ~ ProductsController ~ createVariants ~ variants:', variants);
        return this.productsService.createVariants(productId, variants, files);
    }
    async updateProduct(id, data, image) {
        const updateProductDto = JSON.parse(data);
        return this.productsService.updateProduct(id, updateProductDto, image);
    }
    async createVariant(productId, data, files) {
        const variantData = JSON.parse(data);
        return this.productsService.createVariant(productId, variantData, files);
    }
    async updateVariant(variantId, data, files) {
        const updateVariantDto = JSON.parse(data);
        return this.productsService.updateVariant(variantId, updateVariantDto, files);
    }
    async deleteVariant(variantId) {
        return this.productsService.deleteVariant(variantId);
    }
    async getAllProducts(page = 1, limit = 10, name, brand, gender, rating, minPrice, maxPrice, startDate, endDate) {
        return this.productsService.getAllProductsFilteredAndPaginated(Number(page), Number(limit), {
            name,
            brand,
            gender,
            rating: rating ? Number(rating) : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            startDate,
            endDate,
        });
    }
    async getProductByName(name) {
        return this.productsService.getProductByName(name);
    }
    async getAllProductsClient(page = 1, limit = 10, name, brand, gender, rating, minPrice, maxPrice, startDate, endDate, categories, sizes, sortOrder) {
        return this.productsService.getAllProductsFilteredAndPaginatedClient(Number(page), Number(limit), {
            name,
            brand,
            gender,
            rating: rating ? Number(rating) : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            startDate,
            endDate,
            categories,
            sizes,
            sortOrder,
        });
    }
    async getLandingPageData() {
        const [newArrivals, bestSellers, featuredProducts, categories] = await Promise.all([
            this.productsService.getNewArrivals(),
            this.productsService.getBestSellers(),
            this.productsService.getFeaturedProducts(),
            this.productsService.getAllCategories(),
        ]);
        return {
            newArrivals,
            bestSellers,
            featuredProducts,
            categories,
        };
    }
    async getAllCategories() {
        return this.productsService.getAllCategories();
    }
    async getProductById(id) {
        return this.productsService.getProductById(id);
    }
    async createCategory(data, imageFile) {
        const createCategoryDto = JSON.parse(data);
        let imageUrl = null;
        if (imageFile) {
            const key = `categories/${Date.now()}-${imageFile.originalname}`;
            imageUrl = await this.r2Service.uploadFile(imageFile, key);
        }
        return this.productsService.createCategory({
            ...createCategoryDto,
            imageUrl,
        });
    }
    async updateCategory(id, data, imageFile) {
        const updateCategoryDto = JSON.parse(data);
        let imageUrl = null;
        if (imageFile) {
            const key = `categories/${Date.now()}-${imageFile.originalname}`;
            imageUrl = await this.r2Service.uploadFile(imageFile, key);
        }
        return this.productsService.updateCategory(id, {
            ...updateCategoryDto,
            imageUrl,
        });
    }
    async deleteCategory(id) {
        return this.productsService.deleteCategory(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)('data')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof multer_1.File !== "undefined" && multer_1.File) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':productId/variants'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('variantImages')),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)('variants')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createVariants", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('data')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_b = typeof multer_1.File !== "undefined" && multer_1.File) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Post)(':productId/variant'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images')),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)('data')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createVariant", null);
__decorate([
    (0, common_1.Patch)('variants/:variantId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('newImages')),
    __param(0, (0, common_1.Param)('variantId')),
    __param(1, (0, common_1.Body)('data')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateVariant", null);
__decorate([
    (0, common_1.Delete)('variants/:variantId'),
    __param(0, (0, common_1.Param)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteVariant", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Query)('brand')),
    __param(4, (0, common_1.Query)('gender')),
    __param(5, (0, common_1.Query)('rating')),
    __param(6, (0, common_1.Query)('minPrice')),
    __param(7, (0, common_1.Query)('maxPrice')),
    __param(8, (0, common_1.Query)('startDate')),
    __param(9, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductByName", null);
__decorate([
    (0, common_1.Get)('client'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Query)('brand')),
    __param(4, (0, common_1.Query)('gender')),
    __param(5, (0, common_1.Query)('rating')),
    __param(6, (0, common_1.Query)('minPrice')),
    __param(7, (0, common_1.Query)('maxPrice')),
    __param(8, (0, common_1.Query)('startDate')),
    __param(9, (0, common_1.Query)('endDate')),
    __param(10, (0, common_1.Query)('categories')),
    __param(11, (0, common_1.Query)('sizes')),
    __param(12, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Number, Number, Number, String, String, Array, Array, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllProductsClient", null);
__decorate([
    (0, common_1.Get)('landing-page'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getLandingPageData", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imageFile')),
    __param(0, (0, common_1.Body)('data')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof multer_1.File !== "undefined" && multer_1.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imageFile')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('data')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_d = typeof multer_1.File !== "undefined" && multer_1.File) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteCategory", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        r2_service_1.R2Service])
], ProductsController);
//# sourceMappingURL=products.controller.js.map