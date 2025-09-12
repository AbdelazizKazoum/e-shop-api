import { Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
export declare class OrderRepository extends AbstractRepository<Order> {
    private readonly orderRepository;
    protected readonly logger: Logger;
    constructor(orderRepository: Repository<Order>);
}
