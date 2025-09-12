import { Product } from './product.entity';
import { StockMovement } from 'src/modules/stock-movements/entities/stock-movement.entity';
import { SupplyOrderItem } from 'src/modules/supply-orders/entities/supplyOrderItem.entity';
import { Stock } from '../../stock/entities/stock.entity';
import { Image } from './image.entity';
export declare class Variant {
    id?: string;
    color?: string;
    size: 'SM' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | '4XL';
    qte: number;
    product: Product;
    images: Image[];
    movements?: StockMovement[];
    orderItems?: SupplyOrderItem[];
    stock?: Stock;
}
