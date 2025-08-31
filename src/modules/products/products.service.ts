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
import { UpdateProductDto } from './dto/update-product.dto';

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

  /**
   * Create a new product.
   * - Fetches the category entity by ID.
   * - Saves the product with the provided image and category.
   * - Throws if the category is not found or saving fails.
   */
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
      id: createProductDto.categoryId,
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

  /**
   * Create multiple variants for a product.
   * - Finds the product by ID.
   * - For each variant, creates the variant entity and uploads its images.
   * - Associates uploaded images with the correct variant.
   * - Uses a transaction for atomicity.
   * - Throws if the product is not found or saving fails.
   */
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
  /**
   * Fetch all products with pagination and filters.
   * - Supports filtering by name, brand, gender, rating, price range, and date range.
   * - Returns paginated results with total count.
   * - Joins category data for each product.
   */
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

  /**
   * Fetch all products with pagination and filters.
   * - Supports filtering by name, brand, gender, rating, price range, date range, categories, sizes, and sort order.
   * - Returns paginated results with total count.
   * - Joins category and variant data for each product.
   */
  async getAllProductsFilteredAndPaginatedClient(
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
      categories?: string[]; // e.g. ["Sport", "Accessoires"]
      sizes?: string[]; // e.g. ["XS", "S", "M"]
      sortOrder?:
        | 'Best-Rating'
        | 'Newest'
        | 'low-high'
        | 'Price-high'
        | 'Most-Popular';
    },
  ): Promise<{
    data: Partial<Product>[];
    total: number;
    page: number;
    limit: number;
  }> {
    console.log(
      '🚀 ~ ProductsService ~ getAllProductsFilteredAndPaginatedClient ~ categories:',
      filters.categories,
    );

    try {
      const query = this.productRepository['productRepository']
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.variants', 'variant')
        .leftJoinAndSelect('variant.images', 'image')
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

          'variant.id',
          'variant.color',
          'variant.size',
          'variant.qte',

          'image.id',
          'image.image',
        ]);

      // --- Filters ---
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

      if (filters.categories && filters.categories.length > 0) {
        console.log(
          '🚀 ~ ProductsService ~ getAllProductsFilteredAndPaginatedClient ~ categories:',
          filters.categories,
        );

        query.andWhere('category.displayText IN (:...categories)', {
          categories: filters.categories,
        });
      }

      if (filters.sizes && filters.sizes.length > 0) {
        query.andWhere('variant.size IN (:...sizes)', {
          sizes: filters.sizes,
        });
      }

      // --- Sorting ---
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
          query.orderBy('product.createAt', 'DESC'); // fallback
      }

      // Pagination
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

  // =================================================================
  // === FETCH NEW ARRIVALS ==========================================
  // =================================================================
  /**
   * Fetch the 5 most recently created products.
   * - Orders products by creation date.
   * - Returns the top 5 results.
   */
  async getNewArrivals(): Promise<Product[]> {
    try {
      // Use the repository to find products, ordering by creation date descending
      // and taking only the first 5.
      const newProducts = await this.productRepository.findAll({
        order: {
          createAt: 'DESC',
        },
        take: 5,
        relations: ['category', 'variants', 'variants.images'], // Include category for context
      });

      return newProducts;
    } catch (error) {
      this.logger.error('Failed to fetch new arrival products', error.stack);
      throw new InternalServerErrorException(
        'Failed to fetch new arrival products',
      );
    }
  }

  // =================================================================
  // === FETCH BEST SELLERS ==========================================
  // =================================================================
  /**
   * Fetch the 5 best-selling products.
   * - NOTE: Current logic is a placeholder, ordering by name.
   * - This should be updated later with actual sales data logic.
   * - Returns the top 5 results.
   */
  async getBestSellers(): Promise<Product[]> {
    try {
      // Placeholder logic: Fetching the first 5 products ordered by name (A-Z)
      const bestSellers = await this.productRepository.findAll({
        order: {
          name: 'ASC',
        },
        take: 5,
        relations: ['category', 'variants', 'variants.images'], // Optionally include category details
      });

      return bestSellers;
    } catch (error) {
      this.logger.error('Failed to fetch best-seller products', error.stack);
      throw new InternalServerErrorException(
        'Failed to fetch best-seller products',
      );
    }
  }

  // =================================================================
  // === FETCH FEATURED PRODUCTS (OUR PICKS) =======================
  // =================================================================
  /**
   * Fetch 3 featured products selected by the admin/us.
   * - NOTE: Current logic orders by the 'trending' flag and then by creation date.
   * - Returns the top 3 results.
   */
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      // Fetches the first 3 products, prioritizing those marked as 'trending'.
      const featuredProducts = await this.productRepository.findAll({
        order: {
          trending: 'DESC', // Puts 'true' values first
          createAt: 'DESC',
        },
        take: 3,
        relations: ['category', 'variants', 'variants.images'], // Optionally include category details
      });

      return featuredProducts;
    } catch (error) {
      this.logger.error('Failed to fetch featured products', error.stack);
      throw new InternalServerErrorException(
        'Failed to fetch featured products',
      );
    }
  }

  /**
   * Fetch a single product by its ID.
   * - Loads related category, variants, images, and reviews.
   * - Throws if the product is not found.
   */
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
  // === UPDATE PRODUCT ==================================
  // =================================================================
  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
    image?: MulterFile,
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find the product to update
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
        relations: ['category'], // Load the category relation
      });

      if (!product) {
        throw new NotFoundException(`Product with ID "${productId}" not found`);
      }

      let imagePath = product.image;

      // 2. Handle new image upload
      if (image) {
        // If an old image exists, delete it from R2 storage
        if (product.image) {
          await this.r2Service.deleteFile(product.image);
        }
        // Upload the new image and get its path/key
        const key = `products/main/${Date.now()}-${image.originalname}`;
        imagePath = await this.r2Service.uploadFile(image, key);
      }

      // 3. Handle category update if a new categoryId is provided
      let categoryToUpdate = product.category;
      if (
        updateProductDto.categoryId &&
        updateProductDto.categoryId !== product.category.id
      ) {
        const newCategory = await this.categoryRepository.findOne({
          id: updateProductDto.categoryId,
        });
        if (!newCategory) {
          throw new NotFoundException(
            `Category with ID "${updateProductDto.categoryId}" not found`,
          );
        }
        categoryToUpdate = newCategory;
      }

      // 4. Merge the updated data into the product entity
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { categoryId, ...productData } = updateProductDto;
      queryRunner.manager.merge(Product, product, {
        ...productData,
        image: imagePath,
        category: categoryToUpdate,
      });

      // 5. Save the updated product
      const updatedProduct = await queryRunner.manager.save(Product, product);

      // 6. Commit the transaction
      await queryRunner.commitTransaction();
      return updatedProduct;
    } catch (err) {
      // If any error occurs, roll back the entire transaction
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to update product ${productId}`, err.stack);
      throw new InternalServerErrorException(
        err.message || 'Failed to update product',
      );
    } finally {
      // 7. Always release the query runner to free up the connection
      await queryRunner.release();
    }
  }

  // =================================================================
  // === CREATE SINGLE VARIANT ===========================
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
  // === UPDATE VARIANT ==================================
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
      if (updateVariantDto.deletedImages?.length > 0) {
        // First, get the image entities to find their keys for R2 deletion
        const imagesToDelete = await queryRunner.manager.find(Image, {
          where: { id: In(updateVariantDto.deletedImages) },
        });

        // Delete files from R2 storage
        for (const image of imagesToDelete) {
          // Assuming the 'image' property stores the R2 key
          await this.r2Service.deleteFile(image.image);
        }

        // Then, perform a bulk delete from the database
        await queryRunner.manager.delete(Image, {
          id: In(updateVariantDto.deletedImages),
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

  // =================================================================
  // === DELETE PRODUCT ==============================================
  // =================================================================
  async deleteProduct(productId: string): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find the product with its variants and images
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
        relations: ['variants', 'variants.images'],
      });

      if (!product) {
        throw new NotFoundException(`Product with ID "${productId}" not found`);
      }

      // 2. Delete all images from R2 storage (main image + variant images)
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

      // 3. Remove the product (will cascade to variants and images if set up)
      await queryRunner.manager.remove(Product, product);

      // 4. Commit transaction
      await queryRunner.commitTransaction();

      return { message: 'Product deleted successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to delete product ${productId}`, err.stack);
      throw new InternalServerErrorException(
        err.message || 'Failed to delete product',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // =================================================================
  // === FETCH ALL CATEGORIES ========================================
  // =================================================================
  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.findAll();

      // if (!categories || categories.length === 0) {
      // 	throw new NotFoundException('No categories found');
      // }

      return categories;
    } catch (error) {
      this.logger.error('Failed to fetch categories', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
  // =================================================================
  // === CREATE CATEGORY =============================================
  // =================================================================
  async createCategory(data: Partial<Category>): Promise<Category> {
    let category: Category;
    try {
      category = await this.categoryRepository.create({
        displayText: data.displayText,
        category: data.category,
        imageUrl: data.imageUrl,
      } as Category);

      return category;
    } catch (error) {
      this.logger.error('Failed to create category', error.message);

      // ✅ If the image was uploaded but category creation fails, delete the image
      if (data.imageUrl) {
        try {
          await this.r2Service.deleteFile(data.imageUrl);
          this.logger.log(
            `Deleted uploaded image due to create failure: ${data.imageUrl}`,
          );
        } catch (deleteError) {
          this.logger.error(
            `Failed to delete uploaded image: ${data.imageUrl}`,
            deleteError.message,
          );
        }
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  // =================================================================
  // === UPDATE CATEGORY =============================================
  // =================================================================
  async updateCategory(
    categoryId: string,
    data: Partial<Category>,
  ): Promise<Category> {
    try {
      const updatedCategory = await this.categoryRepository.findOneAndUpdate(
        { id: categoryId },
        data,
      );
      return updatedCategory;
    } catch (error) {
      this.logger.error(
        `Failed to update category ${categoryId}`,
        error.message,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  // =================================================================
  // === DELETE CATEGORY =============================================
  // =================================================================
  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    try {
      await this.categoryRepository.findOneAndDelete({ id: categoryId });
      return { message: 'Category deleted successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to delete category ${categoryId}`,
        error.message,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
