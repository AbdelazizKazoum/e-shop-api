import { Order } from './order.entity';
import { Variant } from 'src/modules/products/entities/variant.entity';
export declare class OrderItem {
    id?: string;
    order?: Order;
    variant: Variant;
    prix_unitaire: number;
    quantite: number;
    sous_total: number;
}
