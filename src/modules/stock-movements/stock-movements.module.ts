import { Module } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovement } from './entities/stock-movement.entity';
import { Stock } from '../products/entities/stock.entity';
import { Variant } from '../products/entities/variant.entity';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  imports: [DatabaseModule.forFeature([StockMovement, Stock, Variant])],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
})
export class StockMovementsModule {}
