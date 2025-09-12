import { Supplier } from 'src/modules/suppliers/entities/supplier.entity';
import { SupplyOrderItem } from './supplyOrderItem.entity';
export declare class SupplyOrder {
    id: string;
    supplier: Supplier;
    items: SupplyOrderItem[];
    status: 'pending' | 'approved' | 'received' | 'cancelled';
    note?: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
}
