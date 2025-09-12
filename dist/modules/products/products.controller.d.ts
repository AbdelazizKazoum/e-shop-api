import { ProductsService } from './products.service';
import { File as MulterFile } from 'multer';
import { R2Service } from '../storage/r2.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly r2Service;
    constructor(productsService: ProductsService, r2Service: R2Service);
    create(data: string, image: MulterFile): Promise<import("./entities/product.entity").Product>;
    createVariants(productId: string, variantsData: string, files: MulterFile[]): Promise<{
        message: string;
    }>;
    updateProduct(id: string, data: string, image?: MulterFile): Promise<import("./entities/product.entity").Product>;
    createVariant(productId: string, data: string, files: MulterFile[]): Promise<import("./entities/variant.entity").Variant>;
    updateVariant(variantId: string, data: string, files: MulterFile[]): Promise<import("./entities/variant.entity").Variant>;
    deleteVariant(variantId: string): Promise<{
        message: string;
    }>;
    getAllProducts(page?: number, limit?: number, name?: string, brand?: string, gender?: string, rating?: number, minPrice?: number, maxPrice?: number, startDate?: string, endDate?: string): Promise<{
        data: Partial<import("./entities/product.entity").Product>[];
        total: number;
        page: number;
        limit: number;
    }>;
    getProductByName(name: string): Promise<import("./entities/product.entity").Product>;
    getAllProductsClient(page?: number, limit?: number, name?: string, brand?: string, gender?: string, rating?: number, minPrice?: number, maxPrice?: number, startDate?: string, endDate?: string, categories?: string[], sizes?: string[], sortOrder?: 'Best-Rating' | 'Newest' | 'low-high' | 'Price-high' | 'Most-Popular'): Promise<{
        data: Partial<import("./entities/product.entity").Product>[];
        total: number;
        page: number;
        limit: number;
    }>;
    getLandingPageData(): Promise<{
        newArrivals: import("./entities/product.entity").Product[];
        bestSellers: import("./entities/product.entity").Product[];
        featuredProducts: import("./entities/product.entity").Product[];
        categories: import("./entities/category.entity").Category[];
    }>;
    getAllCategories(): Promise<import("./entities/category.entity").Category[]>;
    getProductById(id: string): Promise<import("./entities/product.entity").Product>;
    createCategory(data: string, imageFile?: MulterFile): Promise<import("./entities/category.entity").Category>;
    updateCategory(id: string, data: string, imageFile?: MulterFile): Promise<import("./entities/category.entity").Category>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
}
