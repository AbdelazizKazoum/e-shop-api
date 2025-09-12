import { Variant } from 'src/modules/products/entities/variant.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Supplier } from 'src/modules/suppliers/entities/supplier.entity';
import { SupplyOrder } from 'src/modules/supply-orders/entities/supply-order.entity';
import { StockMovementReason, StockMovementType } from '../types/stock-movement-type.enum';
export declare class StockMovement {
    id: string;
    productDetail: Variant;
    type: StockMovementType;
    quantity: number;
    reason: StockMovementReason;
    note?: string;
    supplier?: Supplier | null;
    supplierOrder?: SupplyOrder | null;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    stockMovement: {
        id: string;
    };
}
