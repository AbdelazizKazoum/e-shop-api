import { Order } from './order.entity';
export declare class Payment {
    id: string;
    order: Order;
    methode: 'credit_card' | 'paypal' | 'bank_transfer' | 'Cash-on-Delivery';
    status: 'pending' | 'fulfilled' | 'rejected';
    date: Date;
}
