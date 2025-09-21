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
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("./repositories/product.repository");
const product_entity_1 = require("./entities/product.entity");
const category_repository_1 = require("./repositories/category.repository");
const variant_repository_1 = require("./repositories/variant.repository");
const r2_service_1 = require("../storage/r2.service");
const typeorm_1 = require("typeorm");
const variant_entity_1 = require("./entities/variant.entity");
const image_entity_1 = require("./entities/image.entity");
const stock_entity_1 = require("../stock/entities/stock.entity");
const stock_service_1 = require("../stock/stock.service");
const brands_service_1 = require("../brands/brands.service");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(productRepository, categoryRepository, variantRepository, r2Service, stockService, dataSource, brandsService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.r2Service = r2Service;
        this.stockService = stockService;
        this.dataSource = dataSource;
        this.brandsService = brandsService;
        this.logger = new common_1.Logger(ProductsService_1.name);
    }
    async create(createProductDto, image) {
        console.log('🚀 ~ ProductsService ~ create ~ createProductDto:', createProductDto);
        const category = await this.categoryRepository.findOne({
            id: createProductDto.categoryId,
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        let brand = null;
        if (createProductDto.brand) {
            brand = await this.brandsService.findOne(createProductDto.brand);
            if (!brand) {
                throw new common_1.NotFoundException('Brand not found');
            }
        }
        try {
            const productData = {
                ...createProductDto,
                image: image,
                category: category,
                brand: brand,
            };
            const product = await this.productRepository.create(productData);
            return product;
        }
        catch (error) {
            this.logger.error('Failed to create product', error.message);
            console.error(error);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async getProductByName(name) {
        console.log('🚀 ~ ProductsService ~ getProductByName ~ name:', name);
        const product = await this.productRepository.findOne({ name }, { relations: ['category', 'brand', 'variants', 'variants.images'] });
        console.log('🚀 ~ ProductsService ~ getProductByName ~ product:', product);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async createVariants(productId, variants, files) {
        const product = await this.productRepository.findOne({ id: productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (let i = 0; i < variants.length; i++) {
                const variantData = variants[i];
                const variant = queryRunner.manager.create(variant_entity_1.Variant, {
                    color: variantData.color,
                    size: variantData.size,
                    qte: variantData.qte,
                    product,
                });
                let savedVariant = await queryRunner.manager.save(variant_entity_1.Variant, variant);
                const stock = queryRunner.manager.create(stock_entity_1.Stock, {
                    variant: savedVariant,
                    quantity: variantData.qte,
                });
                const savedStock = await queryRunner.manager.save(stock_entity_1.Stock, stock);
                savedVariant.stock = savedStock;
                savedVariant = await queryRunner.manager.save(variant_entity_1.Variant, savedVariant);
                const variantFiles = files.filter((file) => variantData.images.includes(file.originalname));
                for (const file of variantFiles) {
                    const key = `products/variants/${Date.now()}-${file.originalname}`;
                    const imagePath = await this.r2Service.uploadFile(file, key);
                    const imageEntity = queryRunner.manager.create(image_entity_1.Image, {
                        image: imagePath,
                        variant: savedVariant,
                    });
                    await queryRunner.manager.save(image_entity_1.Image, imageEntity);
                }
            }
            await queryRunner.commitTransaction();
            return { message: 'Variants created successfully' };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            console.error(err);
            throw new common_1.InternalServerErrorException('Failed to create variants');
        }
        finally {
            await queryRunner.release();
        }
    }
    async getAllProductsFilteredAndPaginated(page = 1, limit = 10, filters) {
        try {
            const query = this.productRepository['productRepository']
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.category', 'category')
                .leftJoinAndSelect('product.brand', 'brand')
                .select([
                'product.id',
                'product.name',
                'product.price',
                'product.gender',
                'product.newPrice',
                'product.quantity',
                'product.image',
                'product.rating',
                'product.reviewCount',
                'product.trending',
                'product.createAt',
                'product.status',
                'category.id',
                'category.displayText',
                'brand.id',
                'brand.name',
                'brand.imageUrl',
            ]);
            if (filters.name) {
                query.andWhere('LOWER(product.name) LIKE :name', {
                    name: `%${filters.name.toLowerCase()}%`,
                });
            }
            if (filters.brand) {
                query.andWhere('LOWER(product.brand) LIKE :brand', {
                    brand: `%${filters.brand.toLowerCase()}%`,
                });
            }
            if (filters.gender) {
                query.andWhere('product.gender = :gender', { gender: filters.gender });
            }
            if (filters.rating) {
                query.andWhere('product.rating >= :rating', { rating: filters.rating });
            }
            if (filters.minPrice) {
                query.andWhere('product.price >= :minPrice', {
                    minPrice: filters.minPrice,
                });
            }
            if (filters.maxPrice) {
                query.andWhere('product.price <= :maxPrice', {
                    maxPrice: filters.maxPrice,
                });
            }
            if (filters.startDate) {
                query.andWhere('product.createAt >= :startDate', {
                    startDate: filters.startDate,
                });
            }
            if (filters.endDate) {
                query.andWhere('product.createAt <= :endDate', {
                    endDate: filters.endDate,
                });
            }
            query
                .skip((page - 1) * limit)
                .take(limit)
                .orderBy('product.createAt', 'DESC');
            const [products, total] = await query.getManyAndCount();
            const formatted = products.map((p) => ({
                ...p,
                category: p.category
                    ? {
                        id: p.category.id,
                        displayText: p.category.displayText,
                    }
                    : null,
                brand: p.brand
                    ? {
                        id: p.brand.id,
                        name: p.brand.name,
                        imageUrl: p.brand.imageUrl,
                    }
                    : null,
            }));
            return {
                data: formatted,
                total,
                page,
                limit,
            };
        }
        catch (error) {
            this.logger.error('Failed to fetch products with filters', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async getAllProductsFilteredAndPaginatedClient(page = 1, limit = 10, filters) {
        try {
            const query = this.productRepository['productRepository']
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.category', 'category')
                .leftJoinAndSelect('product.brand', 'brand')
                .leftJoinAndSelect('product.variants', 'variant')
                .leftJoinAndSelect('variant.images', 'image')
                .select([
                'product.id',
                'product.name',
                'product.price',
                'product.gender',
                'product.newPrice',
                'product.quantity',
                'product.image',
                'product.rating',
                'product.reviewCount',
                'product.trending',
                'product.createAt',
                'product.status',
                'category.id',
                'category.displayText',
                'brand.id',
                'brand.name',
                'brand.imageUrl',
                'variant.id',
                'variant.color',
                'variant.size',
                'variant.qte',
                'image.id',
                'image.image',
            ]);
            if (filters.name) {
                query.andWhere('LOWER(product.name) LIKE :name', {
                    name: `%${filters.name.toLowerCase()}%`,
                });
            }
            if (filters.brand &&
                Array.isArray(filters.brand) &&
                filters.brand.length > 0) {
                query.andWhere('brand.name IN (:...brands)', {
                    brands: filters.brand,
                });
            }
            if (filters.gender) {
                query.andWhere('product.gender = :gender', { gender: filters.gender });
            }
            if (filters.rating) {
                query.andWhere('product.rating >= :rating', { rating: filters.rating });
            }
            if (filters.minPrice) {
                query.andWhere('product.price >= :minPrice', {
                    minPrice: filters.minPrice,
                });
            }
            if (filters.maxPrice) {
                query.andWhere('product.price <= :maxPrice', {
                    maxPrice: filters.maxPrice,
                });
            }
            if (filters.startDate) {
                query.andWhere('product.createAt >= :startDate', {
                    startDate: filters.startDate,
                });
            }
            if (filters.endDate) {
                query.andWhere('product.createAt <= :endDate', {
                    endDate: filters.endDate,
                });
            }
            if (filters.categories && filters.categories.length > 0) {
                query.andWhere('category.displayText IN (:...categories)', {
                    categories: filters.categories,
                });
            }
            if (filters.sizes && filters.sizes.length > 0) {
                query.andWhere('variant.size IN (:...sizes)', {
                    sizes: filters.sizes,
                });
            }
            switch (filters.sortOrder) {
                case 'Best-Rating':
                    query.orderBy('product.rating', 'DESC');
                    break;
                case 'Newest':
                    query.orderBy('product.createAt', 'DESC');
                    break;
                case 'low-high':
                    query.orderBy('product.price', 'ASC');
                    break;
                case 'Price-high':
                    query.orderBy('product.price', 'DESC');
                    break;
                case 'Most-Popular':
                    query.orderBy('product.reviewCount', 'DESC');
                    break;
                default:
                    query.orderBy('product.createAt', 'DESC');
            }
            query.skip((page - 1) * limit).take(limit);
            const [products, total] = await query.getManyAndCount();
            const formatted = products.map((p) => ({
                ...p,
                category: p.category
                    ? {
                        id: p.category.id,
                        displayText: p.category.displayText,
                    }
                    : null,
                brand: p.brand
                    ? {
                        id: p.brand.id,
                        name: p.brand.name,
                        imageUrl: p.brand.imageUrl,
                    }
                    : null,
            }));
            return {
                data: formatted,
                total,
                page,
                limit,
            };
        }
        catch (error) {
            this.logger.error('Failed to fetch products with filters', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async getNewArrivals() {
        try {
            const newProducts = await this.productRepository.findAll({
                order: {
                    createAt: 'DESC',
                },
                take: 5,
                relations: ['category', 'variants', 'variants.images'],
            });
            return newProducts;
        }
        catch (error) {
            this.logger.error('Failed to fetch new arrival products', error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch new arrival products');
        }
    }
    async getBestSellers() {
        try {
            const bestSellers = await this.productRepository.findAll({
                order: {
                    name: 'ASC',
                },
                take: 5,
                relations: ['category', 'variants', 'variants.images'],
            });
            return bestSellers;
        }
        catch (error) {
            this.logger.error('Failed to fetch best-seller products', error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch best-seller products');
        }
    }
    async getFeaturedProducts() {
        try {
            const featuredProducts = await this.productRepository.findAll({
                order: {
                    trending: 'DESC',
                    createAt: 'DESC',
                },
                take: 3,
                relations: ['category', 'variants', 'variants.images'],
            });
            return featuredProducts;
        }
        catch (error) {
            this.logger.error('Failed to fetch featured products', error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch featured products');
        }
    }
    async getProductById(id) {
        const product = await this.productRepository.findOne({ id }, {
            relations: [
                'category',
                'brand',
                'variants',
                'variants.images',
                'variants.stock',
            ],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const reviewRepo = this.productRepository['productRepository'].manager.getRepository('Review');
        const firstTwoReviews = await reviewRepo.find({
            where: { product: { id } },
            relations: ['user'],
            order: { reviewDate: 'DESC' },
            take: 2,
            select: ['id', 'title', 'comment', 'rating', 'reviewDate'],
        });
        return { ...product, reviews: firstTwoReviews };
    }
    async getLightProductById(id) {
        const product = await this.productRepository.findOne({ id });
        return product;
    }
    async updateProduct(productId, updateProductDto, image) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const product = await queryRunner.manager.findOne(product_entity_1.Product, {
                where: { id: productId },
                relations: ['category', 'brand'],
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID "${productId}" not found`);
            }
            let imagePath = product.image;
            if (image) {
                if (product.image) {
                    await this.r2Service.deleteFile(product.image);
                }
                const key = `products/main/${Date.now()}-${image.originalname}`;
                imagePath = await this.r2Service.uploadFile(image, key);
            }
            let categoryToUpdate = product.category;
            if (updateProductDto.categoryId &&
                updateProductDto.categoryId !== product.category.id) {
                const newCategory = await this.categoryRepository.findOne({
                    id: updateProductDto.categoryId,
                });
                if (!newCategory) {
                    throw new common_1.NotFoundException(`Category with ID "${updateProductDto.categoryId}" not found`);
                }
                categoryToUpdate = newCategory;
            }
            let brandToUpdate = product.brand;
            if (updateProductDto.brand !== undefined) {
                if (updateProductDto.brand) {
                    const newBrand = await this.brandsService.findOne(updateProductDto.brand);
                    if (!newBrand) {
                        throw new common_1.NotFoundException(`Brand with ID "${updateProductDto.brand}" not found`);
                    }
                    brandToUpdate = newBrand;
                }
                else {
                    brandToUpdate = null;
                }
            }
            const { categoryId, brand, ...productData } = updateProductDto;
            queryRunner.manager.merge(product_entity_1.Product, product, {
                ...productData,
                image: imagePath,
                category: categoryToUpdate,
                brand: brandToUpdate,
            });
            const updatedProduct = await queryRunner.manager.save(product_entity_1.Product, product);
            await queryRunner.commitTransaction();
            return updatedProduct;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to update product ${productId}`, err.stack);
            throw new common_1.InternalServerErrorException(err.message || 'Failed to update product');
        }
        finally {
            await queryRunner.release();
        }
    }
    async createVariant(productId, variantData, files) {
        const product = await this.productRepository.findOne({
            id: productId,
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${productId}" not found`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let variant = queryRunner.manager.create(variant_entity_1.Variant, {
                color: variantData.color,
                size: variantData.size,
                qte: variantData.qte,
                product,
            });
            variant = await queryRunner.manager.save(variant_entity_1.Variant, variant);
            const stock = queryRunner.manager.create(stock_entity_1.Stock, {
                variant,
                quantity: variantData.qte,
            });
            const savedStock = await queryRunner.manager.save(stock_entity_1.Stock, stock);
            variant.stock = savedStock;
            variant = await queryRunner.manager.save(variant_entity_1.Variant, variant);
            if (files?.length > 0) {
                for (const file of files) {
                    const key = `products/variants/${Date.now()}-${file.originalname}`;
                    const imagePath = await this.r2Service.uploadFile(file, key);
                    const imageEntity = queryRunner.manager.create(image_entity_1.Image, {
                        image: imagePath,
                        variant,
                    });
                    await queryRunner.manager.save(image_entity_1.Image, imageEntity);
                }
            }
            await queryRunner.commitTransaction();
            return this.variantRepository.findOne({ id: variant.id }, { relations: ['images', 'stock'] });
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to create variant for product ${productId}`, err.stack);
            throw new common_1.InternalServerErrorException('Failed to create variant');
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateVariant(variantId, updateVariantDto, files) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const variant = await queryRunner.manager.findOne(variant_entity_1.Variant, {
                where: { id: variantId },
                relations: ['images'],
            });
            if (!variant) {
                throw new common_1.NotFoundException(`Variant with ID "${variantId}" not found`);
            }
            if (updateVariantDto.deletedImages?.length > 0) {
                const imagesToDelete = variant.images.filter((img) => updateVariantDto.deletedImages.includes(img.id));
                for (const image of imagesToDelete) {
                    await this.r2Service.deleteFile(image.image);
                }
                variant.images = variant.images.filter((img) => !updateVariantDto.deletedImages.includes(img.id));
            }
            if (files?.length > 0) {
                for (const file of files) {
                    const key = `products/variants/${Date.now()}-${file.originalname}`;
                    const imagePath = await this.r2Service.uploadFile(file, key);
                    const newImage = queryRunner.manager.create(image_entity_1.Image, {
                        image: imagePath,
                    });
                    variant.images.push(newImage);
                }
            }
            variant.color = updateVariantDto.color;
            variant.size = updateVariantDto.size;
            variant.qte = updateVariantDto.qte;
            const updatedVariant = await queryRunner.manager.save(variant_entity_1.Variant, variant);
            await queryRunner.commitTransaction();
            return updatedVariant;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to update variant ${variantId}`, err.stack);
            throw new common_1.InternalServerErrorException(err.message || 'Failed to update variant');
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteVariant(variantId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const variant = await queryRunner.manager.findOne(variant_entity_1.Variant, {
                where: { id: variantId },
                relations: ['images'],
            });
            if (!variant) {
                throw new common_1.NotFoundException(`Variant with ID "${variantId}" not found`);
            }
            if (variant.images?.length > 0) {
                for (const image of variant.images) {
                    await this.r2Service.deleteFile(image.image);
                }
            }
            await queryRunner.manager.remove(variant_entity_1.Variant, variant);
            await queryRunner.commitTransaction();
            return { message: 'Variant deleted successfully' };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to delete variant ${variantId}`, err.stack);
            throw new common_1.InternalServerErrorException(err.message || 'Failed to delete variant');
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteProduct(productId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const product = await queryRunner.manager.findOne(product_entity_1.Product, {
                where: { id: productId },
                relations: ['variants', 'variants.images'],
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID "${productId}" not found`);
            }
            if (product.image) {
                await this.r2Service.deleteFile(product.image);
            }
            if (product.variants?.length > 0) {
                for (const variant of product.variants) {
                    if (variant.images?.length > 0) {
                        for (const image of variant.images) {
                            await this.r2Service.deleteFile(image.image);
                        }
                    }
                }
            }
            await queryRunner.manager.remove(product_entity_1.Product, product);
            await queryRunner.commitTransaction();
            return { message: 'Product deleted successfully' };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to delete product ${productId}`, err.stack);
            throw new common_1.InternalServerErrorException(err.message || 'Failed to delete product');
        }
        finally {
            await queryRunner.release();
        }
    }
    async getAllCategories() {
        try {
            const categories = await this.categoryRepository.findAll();
            return categories;
        }
        catch (error) {
            this.logger.error('Failed to fetch categories', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async createCategory(data) {
        let category;
        try {
            category = await this.categoryRepository.create({
                displayText: data.displayText,
                category: data.category,
                imageUrl: data.imageUrl,
            });
            return category;
        }
        catch (error) {
            console.log('🚀 ~ ProductsService ~ createCategory ~ error:', error);
            this.logger.error('Failed to create category', error.message);
            if (data.imageUrl) {
                try {
                    await this.r2Service.deleteFile(data.imageUrl);
                    this.logger.log(`Deleted uploaded image due to create failure: ${data.imageUrl}`);
                }
                catch (deleteError) {
                    this.logger.error(`Failed to delete uploaded image: ${data.imageUrl}`, deleteError.message);
                }
            }
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async updateCategory(categoryId, data) {
        try {
            const updatedCategory = await this.categoryRepository.findOneAndUpdate({ id: categoryId }, data);
            return updatedCategory;
        }
        catch (error) {
            this.logger.error(`Failed to update category ${categoryId}`, error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async deleteCategory(categoryId) {
        try {
            await this.categoryRepository.findOneAndDelete({ id: categoryId });
            return { message: 'Category deleted successfully' };
        }
        catch (error) {
            this.logger.error(`Failed to delete category ${categoryId}`, error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async getProductsByCategory(categorySearch) {
        try {
            const products = await this.productRepository['productRepository']
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.category', 'category')
                .leftJoinAndSelect('product.variants', 'variant')
                .leftJoinAndSelect('variant.images', 'image')
                .leftJoinAndSelect('variant.stock', 'stock')
                .where('category.displayText = :categorySearch OR category.id = :categorySearch', { categorySearch })
                .orderBy('product.createAt', 'DESC')
                .take(5)
                .getMany();
            return products;
        }
        catch (error) {
            this.logger.error('Failed to fetch products by category', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async updateProductReviewStats(productId) {
        const product = await this.productRepository.findOne({ id: productId }, { relations: ['reviews'] });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${productId}" not found`);
        }
        const reviews = product.reviews || [];
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0
            ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(2))
            : 0;
        product.averageRating = averageRating;
        product.rating = averageRating;
        product.reviewCount = reviewCount;
        await this.productRepository.create(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository,
        category_repository_1.CategoryRepository,
        variant_repository_1.VariantRepository,
        r2_service_1.R2Service,
        stock_service_1.StockService,
        typeorm_1.DataSource,
        brands_service_1.BrandsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map