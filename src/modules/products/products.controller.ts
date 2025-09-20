/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Param,
  UploadedFiles,
  Get,
  Query,
  Patch, // 👈 Import PATCH
  Delete,
  Put, // 👈 Import DELETE
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { File as MulterFile } from 'multer';
import { R2Service } from '../storage/r2.service'; // adjust path if needed
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto'; // 👈 Import the new DTO
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandsService } from '../brands/brands.service'; // 👈 Import BrandsService

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly r2Service: R2Service,
    private readonly brandsService: BrandsService, // 👈 Inject BrandsService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body('data') data: string, @UploadedFile() image: MulterFile) {
    const createProductDto: CreateProductDto = JSON.parse(data);

    let imagePath = null;

    if (image) {
      const key = `products/main/${Date.now()}-${image.originalname}`;
      imagePath = await this.r2Service.uploadFile(image, key);
    }

    // Save product with image path
    const product = await this.productsService.create(
      createProductDto,
      imagePath,
    );

    return product;
  }

  /**
   * Create multiple variants for a product
   */
  @Post(':productId/variants')
  @UseInterceptors(FilesInterceptor('variantImages'))
  async createVariants(
    @Param('productId') productId: string,
    @Body('variants') variantsData: string, // JSON string
    @UploadedFiles() files: MulterFile[],
  ) {
    console.log('🚀 ~ ProductsController ~ createVariants ~ files:', files);
    const variants: CreateVariantDto[] = JSON.parse(variantsData);
    console.log(
      '🚀 ~ ProductsController ~ createVariants ~ variants:',
      variants,
    );

    return this.productsService.createVariants(productId, variants, files);
  }

  // =================================================================
  // === UPDATE PRODUCT ==================================
  // =================================================================
  /**
   * Update a product's main information
   */
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id') id: string,
    @Body('data') data: string, // JSON string of UpdateProductDto
    @UploadedFile() image?: MulterFile,
  ) {
    const updateProductDto: UpdateProductDto = JSON.parse(data);
    return this.productsService.updateProduct(id, updateProductDto, image);
  }

  // =================================================================
  // === CREATE SINGLE VARIANT ===========================
  // =================================================================
  /**
   * Create a single variant for a product
   */
  @Post(':productId/variant')
  @UseInterceptors(FilesInterceptor('images'))
  async createVariant(
    @Param('productId') productId: string,
    @Body('data') data: string, // JSON string of CreateVariantDto
    @UploadedFiles() files: MulterFile[],
  ) {
    const variantData: CreateVariantDto = JSON.parse(data);
    return this.productsService.createVariant(productId, variantData, files);
  }

  // =================================================================
  // === 	UPDATE VARIANT ==================================
  // =================================================================
  /**
   * Update a specific variant by its ID
   */
  @Patch('variants/:variantId')
  @UseInterceptors(FilesInterceptor('newImages')) // Use a different field name for new files
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body('data') data: string, // JSON string of UpdateVariantDto
    @UploadedFiles() files: MulterFile[],
  ) {
    const updateVariantDto: UpdateVariantDto = JSON.parse(data);

    return this.productsService.updateVariant(
      variantId,
      updateVariantDto,
      files,
    );
  }

  // =================================================================
  // === DELETE VARIANT ==================================
  // =================================================================
  /**
   * Delete a specific variant by its ID
   */
  @Delete('variants/:variantId')
  async deleteVariant(@Param('variantId') variantId: string) {
    return this.productsService.deleteVariant(variantId);
  }

  /**
   * Fetch all products with pagination and filters
   */
  @Get()
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('brand') brand?: string,
    @Query('gender') gender?: string,
    @Query('rating') rating?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.productsService.getAllProductsFilteredAndPaginated(
      Number(page),
      Number(limit),
      {
        name,
        brand,
        gender,
        rating: rating ? Number(rating) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        startDate,
        endDate,
      },
    );
  }

  /**
   * Get a product by its name.
   * - Throws a NotFoundException if the product is not found.
   */
  @Get('name/:name')
  async getProductByName(@Param('name') name: string) {
    return this.productsService.getProductByName(name);
  }

  /**
   * Fetch all products with pagination and filters
   */
  @Get('client')
  async getAllProductsClient(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('brand') brand?: string[],
    @Query('gender') gender?: string,
    @Query('rating') rating?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categories') categories?: string[], // categories[]=Sport&categories[]=Accessoires
    @Query('sizes') sizes?: string[], // sizes[]=S&sizes[]=M
    @Query('sortOrder')
    sortOrder?:
      | 'Best-Rating'
      | 'Newest'
      | 'low-high'
      | 'Price-high'
      | 'Most-Popular',
  ) {
    return this.productsService.getAllProductsFilteredAndPaginatedClient(
      Number(page),
      Number(limit),
      {
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
      },
    );
  }

  // =================================================================
  // === FETCH LANDING PAGE DATA =====================================
  // =================================================================
  /**
   * Fetch all data needed for the landing page in a single call.
   * - New Arrivals
   * - Best Sellers
   * - Featured Products (Selected by Us)
   * - All Categories
   * - Top 5 Brands
   */
  @Get('landing-page')
  async getLandingPageData() {
    const [newArrivals, bestSellers, featuredProducts, categories, brands] =
      await Promise.all([
        this.productsService.getNewArrivals(),
        this.productsService.getBestSellers(),
        this.productsService.getFeaturedProducts(),
        this.productsService.getAllCategories(),
        this.brandsService.findAll(1, 5), // 👈 Fetch top 5 brands
      ]);

    return {
      newArrivals,
      bestSellers,
      featuredProducts,
      categories,
      topBrands: brands.data, // 👈 Add brands to response
    };
  }

  // =================================================================
  // === FETCH ALL CATEGORIES ========================================
  // =================================================================
  /**
   * Fetch all categories
   */
  @Get('categories')
  async getAllCategories() {
    return this.productsService.getAllCategories();
  }

  // =================================================================
  // === CREATE CATEGORY =============================================
  // =================================================================
  @Post('categories')
  @UseInterceptors(FileInterceptor('imageFile')) // match the FormData key
  async createCategory(
    @Body('data') data: string, // JSON string of category info
    @UploadedFile() imageFile?: MulterFile,
  ) {
    const createCategoryDto = JSON.parse(data);
    let imageUrl: string | null = null;

    if (imageFile) {
      const key = `categories/${Date.now()}-${imageFile.originalname}`;
      imageUrl = await this.r2Service.uploadFile(imageFile, key);
    }

    return this.productsService.createCategory({
      ...createCategoryDto,
      imageUrl,
    });
  }

  // =================================================================
  // === UPDATE CATEGORY =============================================
  // =================================================================
  @Patch('categories/:id')
  @UseInterceptors(FileInterceptor('imageFile'))
  async updateCategory(
    @Param('id') id: string,
    @Body('data') data: string, // JSON string of update info
    @UploadedFile() imageFile?: MulterFile,
  ) {
    const updateCategoryDto = JSON.parse(data);
    let imageUrl: string | null = null;

    if (imageFile) {
      const key = `categories/${Date.now()}-${imageFile.originalname}`;
      imageUrl = await this.r2Service.uploadFile(imageFile, key);
    }

    return this.productsService.updateCategory(id, {
      ...updateCategoryDto,
      imageUrl,
    });
  }

  // =================================================================
  // === DELETE CATEGORY =============================================
  // =================================================================
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.productsService.deleteCategory(id);
  }

  /**
   * Fetch 5 products by category (name or ID)
   */
  @Get('by-category')
  async getProductsByCategory(@Query('category') category: string) {
    return this.productsService.getProductsByCategory(category);
  }

  /**
   * Fetch a single product by ID
   */
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
}
