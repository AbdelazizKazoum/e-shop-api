import { StockMovement } from 'src/modules/stock-movements/entities/stock-movement.entity';
import { SupplyOrder } from 'src/modules/supply-orders/entities/supply-order.entity';
export declare class Supplier {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    companyName?: string;
    status: 'active' | 'inactive' | 'blacklisted';
    orders: SupplyOrder[];
    createdAt: Date;
    updatedAt: Date;
    stockMovements: StockMovement[];
}
