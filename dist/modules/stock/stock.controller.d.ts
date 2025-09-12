import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { GetQuantitiesDto } from './dto/get-quantities.dto';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    create(createStockDto: CreateStockDto): Promise<import("./entities/stock.entity").Stock>;
    findAll(page?: number, limit?: number, productName?: string, minQte?: number, maxQte?: number, sortBy?: 'newest' | 'oldest'): Promise<{
        data: import("./entities/stock.entity").Stock[];
        total: number;
        page: number;
        limit: number;
    }>;
    getQuantitiesForVariants(getQuantitiesDto: GetQuantitiesDto): Promise<Record<string, number>>;
    getQuantityByVariant(variantId: string): Promise<{
        variantId: string;
        quantity: number;
    }>;
    findOne(id: string): Promise<import("./entities/stock.entity").Stock>;
    update(id: string, updateStockDto: UpdateStockDto): Promise<import("./entities/stock.entity").Stock>;
    remove(id: string): Promise<void>;
}
