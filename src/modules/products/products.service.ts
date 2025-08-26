/* eslint-disable prettier/prettier */
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
      throw new NotFoundException('Category not found');
    }

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
    console.log('🚀 ~ ProductsService ~ createVariants ~ files:', files);

    const product = await this.productRepository.findOne({ id: productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < variants.length; i++) {
        const variantData = variants[i];

        // Create variant entity
        const variant = queryRunner.manager.create('Variant', {
          color: variantData.color,
          size: variantData.size,
          qte: variantData.qte,
          product,
        });
        const savedVariant = await queryRunner.manager.save('Variant', variant);

        // ✅ Find files belonging to this variant using JSON mapping
        const variantFiles = files.filter((file) =>
          variantData.images.includes(file.originalname),
        );

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
  async getAllProductsFilteredAndPaginated(
    page: number = 1,
    limit: number = 10,
    filters: {
      name?: string;
      brand?: string;
      gender?: string;
      rating?: number;
      minPrice?: number;
      maxPrice?: number;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{
    data: Partial<Product>[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const query = this.productRepository['productRepository'] // underlying TypeORM repo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .select([
          'product.id',
          'product.name',
          'product.brand',
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
        ]);

      // Apply filters dynamically
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

      // Pagination
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
      }));

      return {
        data: formatted,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to fetch products with filters', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne(
      { id },
      {
        relations: ['category', 'variants', 'variants.images', 'reviews'],
      },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
