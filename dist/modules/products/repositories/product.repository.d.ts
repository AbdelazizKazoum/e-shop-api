import { Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
export declare class ProductRepository extends AbstractRepository<Product> {
    private readonly productRepository;
    protected readonly logger: Logger;
    constructor(productRepository: Repository<Product>);
}
