import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';
import { OrderStatus, PaymentStatus } from './entities/order.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, user: User | null): Promise<import("./entities/order.entity").Order>;
    findAll(page: number, limit: number, customer?: string, status?: OrderStatus, paymentStatus?: PaymentStatus, minTotal?: number, maxTotal?: number, startDate?: string, endDate?: string): Promise<{
        data: import("./entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateOrder(id: string, body: {
        status?: OrderStatus;
        paymentStatus?: PaymentStatus;
    }): Promise<import("./entities/order.entity").Order>;
    findOne(id: string): string;
    remove(id: string): string;
}
