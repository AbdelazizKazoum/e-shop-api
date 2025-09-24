import { StockMovementType, StockMovementReason } from '../types/stock-movement-type.enum';
export declare class CreateStockMovementDto {
    variantId: string;
    type: StockMovementType;
    quantity: number;
    reason: StockMovementReason;
    supplierId?: string;
    supplierOrderId?: string;
    note?: string;
}
