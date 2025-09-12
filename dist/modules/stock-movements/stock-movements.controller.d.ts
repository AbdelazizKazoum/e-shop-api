import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
export declare class StockMovementsController {
    private readonly stockMovementsService;
    constructor(stockMovementsService: StockMovementsService);
    create(createStockMovementDto: CreateStockMovementDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateStockMovementDto: UpdateStockMovementDto): string;
    remove(id: string): string;
}
