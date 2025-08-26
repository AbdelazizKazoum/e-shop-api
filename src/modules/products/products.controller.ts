import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Param,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { File as MulterFile } from 'multer';
import { R2Service } from '../storage/r2.service'; // adjust path if needed
import { CreateVariantDto } from './dto/create-variant.dto';

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
}
