import { Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
export declare class CategoryRepository extends AbstractRepository<Category> {
    private readonly categoryRepository;
    protected readonly logger: Logger;
    constructor(categoryRepository: Repository<Category>);
}
