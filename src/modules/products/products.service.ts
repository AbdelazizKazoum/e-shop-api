import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
// import { File as MulterFile } from 'multer';
import { ProductRepository } from './repositories/product.repository';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { VariantRepository } from './repositories/variant.repository';
import { ImageRepository } from './repositories/image.repository';
import { R2Service } from '../storage/r2.service';
import { DataSource } from 'typeorm';
import { File as MulterFile } from 'multer';
import { CreateVariantDto } from './dto/create-variant.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository, // inject this

    private readonly variantRepository: VariantRepository,
    private readonly imageRepository: ImageRepository,
    private readonly r2Service: R2Service,
    private readonly dataSource: DataSource, // needed for transaction
  ) {}

  async create(
    createProductDto: CreateProductDto,
    image?: string,
  ): Promise<Product> {
    console.log(
      '🚀 ~ ProductsService ~ create ~ createProductDto:',
      createProductDto,
    );

    // Fetch the category entity
    const category: Category = await this.categoryRepository.findOne({
      id: '1', //createProductDto.categoryId,
    });
    if (!category) {
      throw new Error('Category not found');
    }
    console.log('🚀 ~ ProductsService ~ create ~ category:', category);

    try {
      const productData = {
        ...createProductDto,
        image: image,
        category: category, // assign the entity
      };

      const product = await this.productRepository.create(productData);
      return product;
    } catch (error) {
      this.logger.error('Failed to create product', error.message);
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async createVariants(
    productId: string,
    variants: CreateVariantDto[],
    files: MulterFile[],
  ) {
    const product = await this.productRepository.findOne({ id: productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let fileIndex = 0;

      for (let i = 0; i < variants.length; i++) {
        const variantData = variants[i];

        // Create variant
        const variant = queryRunner.manager.create('Variant', {
          color: variantData.color,
          size: variantData.size,
          qte: variantData.qte,
          product,
        });
        const savedVariant = await queryRunner.manager.save('Variant', variant);

        // Attach the same number of files as were sent for this variant
        const variantImageCount = variantData.images?.length || 0;
        const variantFiles = files.slice(
          fileIndex,
          fileIndex + variantImageCount,
        );
        fileIndex += variantImageCount;

        for (const file of variantFiles) {
          const key = `products/variants/${Date.now()}-${file.originalname}`;
          const imagePath = await this.r2Service.uploadFile(file, key);

          const imageEntity = queryRunner.manager.create('Image', {
            image: imagePath,
            variant: savedVariant,
          });

          await queryRunner.manager.save('Image', imageEntity);
        }
      }

      await queryRunner.commitTransaction();
      return { message: 'Variants created successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
      throw new InternalServerErrorException('Failed to create variants');
    } finally {
      await queryRunner.release();
    }
  }
}
