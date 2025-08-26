import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { File as MulterFile } from 'multer';
import { ProductRepository } from './repositories/product.repository';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly productRepository: ProductRepository) {}

  async create(
    createProductDto: CreateProductDto,
    image?: MulterFile,
  ): Promise<Product> {
    try {
      const productData = {
        ...createProductDto,
        image: image ? `/uploads/${image.filename}` : null,
        // category: { id: createProductDto.category }, // Assuming categoryId is provided
      };

      // Use the repository's create method (already saves)
      const product = await this.productRepository.create(productData);
      return product;
    } catch (error) {
      this.logger.error('Failed to create product', error);
      throw error;
    }
  }
}
