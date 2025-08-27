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
import { DataSource, In } from 'typeorm';
import { File as MulterFile } from 'multer';
import { CreateVariantDto } from './dto/create-variant.dto';
import { Variant } from './entities/variant.entity';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Image } from './entities/image.entity';

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

  // =================================================================
  // === NEW METHOD: CREATE SINGLE VARIANT ===========================
  // =================================================================
  async createVariant(
    productId: string,
    variantData: CreateVariantDto,
    files: MulterFile[],
  ): Promise<Variant> {
    const product = await this.productRepository.findOne({
      id: productId,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create the variant entity
      const variant = queryRunner.manager.create(Variant, {
        color: variantData.color,
        size: variantData.size,
        qte: variantData.qte,
        product,
      });
      const savedVariant = await queryRunner.manager.save(Variant, variant);

      // 2. Handle the image uploads for the variant
      if (files?.length > 0) {
        for (const file of files) {
          const key = `products/variants/${Date.now()}-${file.originalname}`;
          const imagePath = await this.r2Service.uploadFile(file, key);

          const imageEntity = queryRunner.manager.create(Image, {
            image: imagePath,
            variant: savedVariant,
          });
          await queryRunner.manager.save(Image, imageEntity);
        }
      }

      await queryRunner.commitTransaction();

      // 3. Return the newly created variant with its images
      return this.variantRepository.findOne(
        {
          id: savedVariant.id,
        },
        { relations: ['images'] },
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to create variant for product ${productId}`,
        err.stack,
      );
      throw new InternalServerErrorException('Failed to create variant');
    } finally {
      await queryRunner.release();
    }
  }

  // =================================================================
  // === NEW METHOD: UPDATE VARIANT ==================================
  // =================================================================
  async updateVariant(
    variantId: string,
    updateVariantDto: UpdateVariantDto,
    files?: MulterFile[],
  ): Promise<Variant> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 1. Find the variant to update
    const variant = (await queryRunner.manager.findOne('Variant', {
      where: { id: variantId },
    })) as Variant;

    if (!variant) {
      throw new NotFoundException(`Variant with ID "${variantId}" not found`);
    }

    try {
      // 2. Handle image deletions if any are specified
      if (updateVariantDto.imageIdsToDelete?.length > 0) {
        // First, get the image entities to find their keys for R2 deletion
        const imagesToDelete = await queryRunner.manager.find(Image, {
          where: { id: In(updateVariantDto.imageIdsToDelete) },
        });

        // Delete files from R2 storage
        for (const image of imagesToDelete) {
          // Assuming the 'image' property stores the R2 key
          await this.r2Service.deleteFile(image.image);
        }

        // Then, perform a bulk delete from the database
        await queryRunner.manager.delete(Image, {
          id: In(updateVariantDto.imageIdsToDelete),
        });
      }

      // 3. Handle new image uploads
      if (files?.length > 0) {
        for (const file of files) {
          const key = `products/variants/${Date.now()}-${file.originalname}`;
          const imagePath = await this.r2Service.uploadFile(file, key);

          const newImage = queryRunner.manager.create(Image, {
            image: imagePath,
            variant: variant,
          });
          await queryRunner.manager.save(Image, newImage);
        }
      }

      // 4. Update variant's own properties
      queryRunner.manager.merge(Variant, variant, {
        color: updateVariantDto.color,
        size: updateVariantDto.size,
        qte: updateVariantDto.qte,
      });
      await queryRunner.manager.save(Variant, variant);

      // 5. Commit the transaction
      await queryRunner.commitTransaction();

      // Return the fully updated variant with its relations
      return this.variantRepository.findOne(
        {
          id: variantId,
        },
        { relations: ['images'] },
      );
    } catch (err) {
      // If anything fails, roll back the entire transaction
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to update variant ${variantId}`, err.stack);
      throw new InternalServerErrorException(
        err.message || 'Failed to update variant',
      );
    } finally {
      // IMPORTANT: Always release the query runner
      await queryRunner.release();
    }
  }

  // =================================================================
  // === DELETE VARIANT ==================================
  // =================================================================
  async deleteVariant(variantId: string): Promise<{ message: string }> {
    // We use a transaction to ensure that deleting files and DB records is atomic
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find the variant and its associated images
      const variant = await queryRunner.manager.findOne(Variant, {
        where: { id: variantId },
        relations: ['images'],
      });

      if (!variant) {
        throw new NotFoundException(`Variant with ID "${variantId}" not found`);
      }

      // 2. Delete all associated images from R2 storage
      if (variant.images?.length > 0) {
        for (const image of variant.images) {
          await this.r2Service.deleteFile(image.image);
        }
      }

      // 3. Delete the variant from the database.
      // Because of `onDelete: 'CASCADE'` in the Image entity,
      // TypeORM will automatically delete the associated image records.
      await queryRunner.manager.remove(Variant, variant);

      // 4. Commit transaction
      await queryRunner.commitTransaction();

      return { message: 'Variant deleted successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to delete variant ${variantId}`, err.stack);
      throw new InternalServerErrorException(
        err.message || 'Failed to delete variant',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
