import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
export declare class StockMovementsService {
    create(createStockMovementDto: CreateStockMovementDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateStockMovementDto: UpdateStockMovementDto): string;
    remove(id: number): string;
}
