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
  Delete, // 👈 Import DELETE
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { File as MulterFile } from 'multer';
import { R2Service } from '../storage/r2.service'; // adjust path if needed
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto'; // 👈 Import the new DTO

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly r2Service: R2Service, // inject R2 service
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
  // ===  UPDATE VARIANT ==================================
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
   * Fetch a single product by ID
   */
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
}
