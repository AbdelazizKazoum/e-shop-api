/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderRepository } from './repositories/order.repository';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Address } from '../users/entities/address.entity';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { Variant } from '../products/entities/variant.entity';
import { OrderItem } from './entities/orderItem.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly dataSource: DataSource, // needed for transaction
  ) {}

  // order.service.ts
  async createOrder(dto: CreateOrderDto, userId?: string) {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Load user if logged in
      const user = userId
        ? await manager.findOne(User, { where: { id: userId } })
        : null;

      // 2. Create address
      const address = manager.create(Address, {
        firstName: dto.shippingAddress.firstName,
        lastName: dto.shippingAddress.lastName,
        address: dto.shippingAddress.address,
        city: dto.shippingAddress.city,
        country: dto.shippingAddress.country,
        zipCode: dto.shippingAddress.zipCode,
        addressType: dto.shippingAddress.addressType,
        phone: dto.contactInfo.phone,
        email: dto.contactInfo.email,
        user,
      });
      await manager.save(address);

      // 3. Create order
      const order = manager.create(Order, {
        user,
        total: dto.totalAmount,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        shippingAddress: address,
      });
      await manager.save(order);

      // 4. Create items
      for (const item of dto.items) {
        const variant = await manager.findOneByOrFail(Variant, {
          id: item.variantId,
        });

        const orderItem = manager.create(OrderItem, {
          order,
          variant,
          prix_unitaire: item.price,
          quantite: item.quantity,
          sous_total: item.price * item.quantity,
        });
        await manager.save(orderItem);
      }

      // 5. Create payment
      const payment = manager.create(Payment, {
        order,
        methode: dto.paymentInfo.method,
        status: 'pending',
        date: new Date(),
      });
      await manager.save(payment);

      return order;
    });
  }

  /**
   * Fetch all orders with pagination and filters.
   * - Supports filtering by customer name/email, status, paymentStatus, total range, and date range.
   * - Returns paginated results with total count.
   * - Joins related data for a comprehensive view.
   */
  async getAllOrdersFilteredAndPaginated(
    page: number = 1,
    limit: number = 10,
    filters: {
      customer?: string; // Search by name or email
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      minTotal?: number;
      maxTotal?: number;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const query = this.orderRepository['orderRepository'] // access underlying TypeORM repo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.shippingAddress', 'shippingAddress')
        .leftJoin('order.user', 'user') // Use leftJoin instead of leftJoinAndSelect if you only select specific fields
        .leftJoinAndSelect('order.details', 'details')
        .leftJoinAndSelect('details.variant', 'variant')
        .leftJoinAndSelect('variant.product', 'product') // Join product from variant
        .select([
          'order.id',
          'order.createdAt',
          'order.status',
          'order.paymentStatus',
          'order.total',
          'shippingAddress.firstName',
          'shippingAddress.lastName',
          'shippingAddress.email',
          'user.id',
          // 'user.name',
          'details.id',
          'details.quantite',
          'details.prix_unitaire',

          'variant.id',
          'variant.size',
          'variant.color',
          'product.name',
          'product.image',
        ]);

      // Apply filters dynamically
      if (filters.customer) {
        const customerQuery = `%${filters.customer.toLowerCase()}%`;
        query.andWhere(
          '(LOWER(shippingAddress.firstName) LIKE :customer OR LOWER(shippingAddress.lastName) LIKE :customer OR LOWER(shippingAddress.email) LIKE :customer)',
          { customer: customerQuery },
        );
      }

      if (filters.status) {
        query.andWhere('order.status = :status', { status: filters.status });
      }

      if (filters.paymentStatus) {
        query.andWhere('order.paymentStatus = :paymentStatus', {
          paymentStatus: filters.paymentStatus,
        });
      }

      if (filters.minTotal) {
        query.andWhere('order.total >= :minTotal', {
          minTotal: filters.minTotal,
        });
      }

      if (filters.maxTotal) {
        query.andWhere('order.total <= :maxTotal', {
          maxTotal: filters.maxTotal,
        });
      }

      if (filters.startDate) {
        query.andWhere('order.createdAt >= :startDate', {
          startDate: filters.startDate,
        });
      }

      if (filters.endDate) {
        query.andWhere('order.createdAt <= :endDate', {
          endDate: filters.endDate,
        });
      }

      // Pagination and Ordering
      query
        .orderBy('order.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      const [orders, total] = await query.getManyAndCount();

      return {
        data: orders,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to fetch orders with filters', error.stack);
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
