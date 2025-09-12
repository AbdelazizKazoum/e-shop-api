import { CreateOrderDto } from './dto/create-order.dto';
import { OrderRepository } from './repositories/order.repository';
import { DataSource } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { StockService } from '../stock/stock.service';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly dataSource;
    private readonly stockService;
    private readonly logger;
    constructor(orderRepository: OrderRepository, dataSource: DataSource, stockService: StockService);
    createOrder(dto: CreateOrderDto, userId?: string): Promise<Order>;
    getAllOrdersFilteredAndPaginated(page: number, limit: number, filters: {
        customer?: string;
        status?: OrderStatus;
        paymentStatus?: PaymentStatus;
        minTotal?: number;
        maxTotal?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        data: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateOrder(orderId: string, updates: {
        status?: OrderStatus;
        paymentStatus?: PaymentStatus;
    }): Promise<Order>;
    findOne(id: number): string;
    remove(id: number): string;
}
