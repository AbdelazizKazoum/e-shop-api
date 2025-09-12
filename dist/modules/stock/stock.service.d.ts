import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockRepository } from './repositories/stock.repository';
import { Stock } from './entities/stock.entity';
import { EntityManager } from 'typeorm';
export declare class StockService {
    private readonly stockRepository;
    constructor(stockRepository: StockRepository);
    create(createStockDto: CreateStockDto): Promise<Stock>;
    decreaseStockForVariant(variantId: string, quantityToDecrease: number, manager: EntityManager): Promise<Stock>;
    findAllWithFiltersAndPagination(page: number, limit: number, filters: {
        productName?: string;
        minQte?: number;
        maxQte?: number;
        sortBy?: 'newest' | 'oldest';
    }): Promise<{
        data: Stock[];
        total: number;
        page: number;
        limit: number;
    }>;
    findAll(): Promise<Stock[]>;
    findOne(id: string): Promise<Stock>;
    getStockQuantityByVariant(variantId: string): Promise<number>;
    getQuantitiesForVariants(variantIds: string[]): Promise<Record<string, number>>;
    update(id: string, updateStockDto: UpdateStockDto): Promise<Stock>;
    remove(id: string): Promise<void>;
}
