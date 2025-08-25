import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { StockMovementsModule } from './modules/stock-movements/stock-movements.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { SupplyOrdersModule } from './modules/supply-orders/supply-orders.module';

@Module({
  imports: [CoreModule, SharedModule, AuthModule, ProductsModule, OrdersModule, UsersModule, StockMovementsModule, SuppliersModule, SupplyOrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
