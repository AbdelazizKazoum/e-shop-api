import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Payment } from './entities/payment.entity';
import { OrderItem } from './entities/orderItem.entity';
import { DatabaseModule } from 'src/core/database/database.module';
import { OrderRepository } from './repositories/order.repository';

@Module({
  imports: [DatabaseModule.forFeature([Order, OrderItem, Payment])],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule {}
