import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './repositories/product.repository';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { VariantRepository } from './repositories/variant.repository';
import { R2Service } from '../storage/r2.service';
import { DataSource } from 'typeorm';
import { File as MulterFile } from 'multer';
import { CreateVariantDto } from './dto/create-variant.dto';
import { Variant } from './entities/variant.entity';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockService } from '../stock/stock.service';
import { Brand } from '../brands/entities/brand.entity';
import { BrandsService } from '../brands/brands.service';
export declare class ProductsService {
    private readonly productRepository;
    private readonly categoryRepository;
    private readonly variantRepository;
    private readonly r2Service;
    private readonly stockService;
    private readonly dataSource;
    private readonly brandsService;
    private readonly logger;
    constructor(productRepository: ProductRepository, categoryRepository: CategoryRepository, variantRepository: VariantRepository, r2Service: R2Service, stockService: StockService, dataSource: DataSource, brandsService: BrandsService);
    create(createProductDto: CreateProductDto, image?: string): Promise<Product>;
    getProductByName(name: string): Promise<Product>;
    createVariants(productId: string, variants: CreateVariantDto[], files: MulterFile[]): Promise<{
        message: string;
    }>;
    getAllProductsFilteredAndPaginated(page: number, limit: number, filters: {
        name?: string;
        brand?: string;
        gender?: string;
        rating?: number;
        minPrice?: number;
        maxPrice?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        data: Partial<Product>[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAllProductsFilteredAndPaginatedClient(page: number, limit: number, filters: {
        name?: string;
        brand?: string[];
        gender?: string;
        rating?: number;
        minPrice?: number;
        maxPrice?: number;
        startDate?: string;
        endDate?: string;
        categories?: string[];
        sizes?: string[];
        sortOrder?: 'Best-Rating' | 'Newest' | 'low-high' | 'Price-high' | 'Most-Popular';
    }): Promise<{
        data: Partial<Product>[];
        total: number;
        page: number;
        limit: number;
    }>;
    getNewArrivals(): Promise<Product[]>;
    getBestSellers(): Promise<Product[]>;
    getFeaturedProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<{
        reviews: import("typeorm").ObjectLiteral[];
        id: string;
        name: string;
        description: string;
        brand?: Brand;
        gender: string;
        quantity?: number;
        image?: string;
        rating?: number;
        reviewCount?: number;
        price: number;
        newPrice?: number;
        status?: "active" | "inactive" | "archived";
        trending?: boolean;
        tags?: string[];
        createAt?: string;
        category: Category;
        variants?: Variant[];
        averageRating?: number;
    }>;
    getLightProductById(id: string): Promise<Product>;
    updateProduct(productId: string, updateProductDto: UpdateProductDto, image?: MulterFile): Promise<Product>;
    createVariant(productId: string, variantData: CreateVariantDto, files: MulterFile[]): Promise<Variant>;
    updateVariant(variantId: string, updateVariantDto: UpdateVariantDto, files?: MulterFile[]): Promise<Variant>;
    deleteVariant(variantId: string): Promise<{
        message: string;
    }>;
    deleteProduct(productId: string): Promise<{
        message: string;
    }>;
    getAllCategories(): Promise<Category[]>;
    createCategory(data: Partial<Category>): Promise<Category>;
    updateCategory(categoryId: string, data: Partial<Category>): Promise<Category>;
    deleteCategory(categoryId: string): Promise<{
        message: string;
    }>;
    getProductsByCategory(categorySearch: string): Promise<Product[]>;
    updateProductReviewStats(productId: string): Promise<void>;
    getVariantsByProductNamePaginated(productName: string, page?: number, limit?: number): Promise<{
        data: Variant[];
        total: number;
        page: number;
        limit: number;
    }>;
}
