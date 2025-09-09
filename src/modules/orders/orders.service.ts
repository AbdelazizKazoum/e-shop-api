/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { StockService } from '../stock/stock.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly dataSource: DataSource, // needed for transaction
    private readonly stockService: StockService,
  ) {}

  // ✅ Updated createOrder method with stock validation
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

      // 4. Validate stock and create items
      for (const item of dto.items) {
        // Find the variant and eagerly load its stock and product relations
        const variant = await manager.findOne(Variant, {
          where: { id: item.variantId },
          relations: ['stock', 'product'], // Eagerly load stock and product
        });

        // Handle case where variant doesn't exist
        if (!variant) {
          throw new NotFoundException(
            `Product variant with ID "${item.variantId}" not found.`,
          );
        }

        // Check for stock availability
        if (!variant.stock) {
          throw new InternalServerErrorException(
            `Stock information is missing for product: "${variant.product.name}".`,
          );
        }

        if (variant.stock.quantity < item.quantity) {
          throw new BadRequestException(
            `Out of stock for "${variant.product.name}" (Size: ${variant.size}, Color: ${variant.color}). Only ${variant.stock.quantity} left.`,
          );
        }

        // If stock is available, proceed to create the order item
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
          'shippingAddress.address',
          'shippingAddress.city',
          'shippingAddress.phone',
          'shippingAddress.zipCode',
          'shippingAddress.country',
          'shippingAddress.addressType',

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

  // ✅ Update order (status and/or paymentStatus)
  async updateOrder(
    orderId: string,
    updates: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
    },
  ): Promise<Order> {
    // Use a transaction to ensure atomicity
    return this.dataSource.transaction(async (manager) => {
      try {
        // Find the order with all its items and their variants
        const order = await manager.findOne(Order, {
          where: { id: orderId },
          relations: ['details', 'details.variant'],
        });

        if (!order) {
          throw new NotFoundException(`Order with id ${orderId} not found`);
        }

        const originalStatus = order.status;

        // Apply updates to the order object
        if (updates.status) {
          order.status = updates.status;
        }
        if (updates.paymentStatus) {
          order.paymentStatus = updates.paymentStatus;
        }

        // --- CORE LOGIC: Check if status is changing to 'delivered' ---
        if (
          updates.status === OrderStatus.DELIVERED &&
          originalStatus !== OrderStatus.DELIVERED
        ) {
          this.logger.log(
            `Order ${orderId} status changed to DELIVERED. Updating stock...`,
          );

          // Iterate over each item in the order and decrease stock
          for (const item of order.details) {
            if (!item.variant || !item.variant.id) {
              throw new InternalServerErrorException(
                `Order item ${item.id} is missing variant information.`,
              );
            }
            await this.stockService.decreaseStockForVariant(
              item.variant.id,
              item.quantite,
              manager, // Pass the transaction manager to the service
            );
          }
        }

        // Save the updated order within the transaction
        return await manager.save(order);
      } catch (error) {
        this.logger.error(
          `Failed to update order with id ${orderId}`,
          error.stack,
        );
        // Rethrow the original error to be handled by NestJS
        throw error;
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
