import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
export declare class StockMovementsController {
    private readonly stockMovementsService;
    constructor(stockMovementsService: StockMovementsService);
    create(createStockMovementDto: CreateStockMovementDto): Promise<import("./entities/stock-movement.entity").StockMovement>;
    findAll(page?: number, limit?: number, type?: string, reason?: string, variantId?: string, supplierId?: string, userId?: string, startDate?: string, endDate?: string): Promise<{
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
