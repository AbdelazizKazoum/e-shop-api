import { Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
export declare class BrandRepository extends AbstractRepository<Brand> {
    private readonly brandRepository;
    protected readonly logger: Logger;
    constructor(brandRepository: Repository<Brand>);
}
