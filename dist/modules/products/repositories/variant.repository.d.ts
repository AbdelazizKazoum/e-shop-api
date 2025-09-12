import { Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Variant } from '../entities/variant.entity';
export declare class VariantRepository extends AbstractRepository<Variant> {
    private readonly variantRepository;
    protected readonly logger: Logger;
    constructor(variantRepository: Repository<Variant>);
}
