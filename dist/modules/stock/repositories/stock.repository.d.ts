import { Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';
export declare class StockRepository extends AbstractRepository<Stock> {
    private readonly stockRepository;
    protected readonly logger: Logger;
    constructor(stockRepository: Repository<Stock>);
}
