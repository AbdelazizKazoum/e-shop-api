import { Module } from '@nestjs/common';
import { SupplyOrdersService } from './supply-orders.service';
import { SupplyOrdersController } from './supply-orders.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { SupplyOrder } from './entities/supply-order.entity';
import { SupplyOrderItem } from './entities/supplyOrderItem.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([SupplyOrder, SupplyOrderItem, Supplier]),
  ],
  controllers: [SupplyOrdersController],
  providers: [SupplyOrdersService],
})
export class SupplyOrdersModule {}
