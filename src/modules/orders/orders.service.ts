import { Injectable } from '@nestjs/common';
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
        state: dto.shippingAddress.state,
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
        date_order: new Date(dto.orderDate),
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

  async findAll() {
    return await this.orderRepository.findAll({
      relations: [
        'user',
        'shippingAddress',
        'items',
        'items.variant',
        'payment',
      ],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
