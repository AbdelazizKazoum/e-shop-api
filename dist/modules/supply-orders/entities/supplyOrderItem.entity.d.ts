import { Variant } from 'src/modules/products/entities/variant.entity';
import { SupplyOrder } from './supply-order.entity';
export declare class SupplyOrderItem {
    id: string;
    order: SupplyOrder;
    variant: Variant;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}
