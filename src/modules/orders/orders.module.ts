/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Payment } from './entities/payment.entity';
import { OrderItem } from './entities/orderItem.entity';
import { DatabaseModule } from 'src/core/database/database.module';
import { OrderRepository } from './repositories/order.repository';
import { jwtConstants } from 'src/shared/constants/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtStrategy } from '../auth/stratigies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule.forFeature([Order, OrderItem, Payment]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.jwtTokenSecret,
      signOptions: jwtConstants.jwtExpirationTime
        ? { expiresIn: jwtConstants.jwtExpirationTime }
        : undefined,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, JwtAuthGuard, JwtStrategy],
})
export class OrdersModule {}
