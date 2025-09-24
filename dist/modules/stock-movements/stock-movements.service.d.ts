import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { StockMovementRepository } from './repositories/stock-movement.repository';
export declare class StockMovementsService {
    private readonly stockMovementRepository;
    constructor(stockMovementRepository: StockMovementRepository);
    create(createStockMovementDto: CreateStockMovementDto): Promise<import("./entities/stock-movement.entity").StockMovement>;
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
        data: import("./entities/stock-movement.entity").StockMovement[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./entities/stock-movement.entity").StockMovement>;
    update(id: string, updateStockMovementDto: UpdateStockMovementDto): Promise<import("./entities/stock-movement.entity").StockMovement>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
