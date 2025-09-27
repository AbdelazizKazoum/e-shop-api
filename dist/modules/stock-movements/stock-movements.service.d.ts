import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { StockMovementRepository } from './repositories/stock-movement.repository';
import { DataSource } from 'typeorm';
import { StockMovement } from './entities/stock-movement.entity';
export declare class StockMovementsService {
    private readonly stockMovementRepository;
    private readonly dataSource;
    constructor(stockMovementRepository: StockMovementRepository, dataSource: DataSource);
    create(createStockMovementDto: CreateStockMovementDto): Promise<StockMovement>;
    findAll(query: {
        page?: number;
        limit?: number;
        type?: string;
        reason?: string;
        variantId?: string;
        supplierId?: string;
        userId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        data: StockMovement[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<StockMovement>;
    update(id: string, updateStockMovementDto: UpdateStockMovementDto): Promise<StockMovement>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
