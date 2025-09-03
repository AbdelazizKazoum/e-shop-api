import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { Stock } from './entities/stock.entity';
import { StockRepository } from './repositories/stock.repository';

@Module({
  imports: [DatabaseModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService, StockRepository],
  exports: [StockService],
})
export class StockModule {}
