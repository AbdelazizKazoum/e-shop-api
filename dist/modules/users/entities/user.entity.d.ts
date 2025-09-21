import { Address } from './address.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { StockMovement } from 'src/modules/stock-movements/entities/stock-movement.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
export declare class User {
    id: string;
    email: string;
    username?: string;
    cin?: string;
    image?: string;
    firstName?: string;
    lastName?: string;
    tel?: number;
    password: string;
    role: 'admin' | 'client';
    primaryAddress?: string;
    status?: string;
    created_at: Date;
    addressList?: Address[];
    orders?: Order[];
    reviews?: Review[];
    stockMovements?: StockMovement[];
    provider?: string;
    providerId?: string;
}
