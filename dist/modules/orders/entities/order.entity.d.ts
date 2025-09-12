import { User } from 'src/modules/users/entities/user.entity';
import { Address } from 'src/modules/users/entities/address.entity';
import { Payment } from './payment.entity';
import { OrderItem } from './orderItem.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare enum PaymentStatus {
    PAID = "paid",
    UNPAID = "unpaid"
}
export declare class Order {
    id: string;
    user: User;
    createdAt: Date;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    total: number;
    details: OrderItem[];
    shippingAddress: Address;
    payment: Payment;
}
