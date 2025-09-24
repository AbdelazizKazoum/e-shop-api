import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { StockMovement } from '../entities/stock-movement.entity';
export declare class StockMovementRepository extends AbstractRepository<StockMovement> {
    private readonly stockMovementRepository;
    protected readonly logger: Logger;
    constructor(stockMovementRepository: Repository<StockMovement>);
}
