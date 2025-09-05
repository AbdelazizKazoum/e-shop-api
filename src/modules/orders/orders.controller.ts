/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { GetUserOrNull } from 'src/shared/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { OrderStatus, PaymentStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(OptionalJwtAuthGuard) // 👈 allows guest or auth
  @Post()
  async create(
    @Body() dto: CreateOrderDto,
    @GetUserOrNull() user: User | null,
  ) {
    console.log('🚀 ~ OrdersController ~ create ~ dto:', dto);
    return await this.ordersService.createOrder(dto, user?.id ?? null);
  }

  /**
   * Handles GET requests to fetch all orders with filtering and pagination.
   * @param page - The current page number for pagination.
   * @param limit - The number of items to return per page.
   * @param customer - A search term for customer's first name, last name, or email.
   * @param status - The order status to filter by (e.g., 'pending', 'shipped').
   * @param paymentStatus - The payment status to filter by (e.g., 'paid', 'unpaid').
   * @param minTotal - The minimum total amount for the order.
   * @param maxTotal - The maximum total amount for the order.
   * @param startDate - The start date of the date range filter.
   * @param endDate - The end date of the date range filter.
   */
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('customer') customer?: string,
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('minTotal') minTotal?: number,
    @Query('maxTotal') maxTotal?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // Group filters into a single object
    const filters = {
      customer,
      status,
      paymentStatus,
      minTotal,
      maxTotal,
      startDate,
      endDate,
    };

    // Call the service method with the parsed parameters
    return this.ordersService.getAllOrdersFilteredAndPaginated(
      page,
      limit,
      filters,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(id, updateOrderDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
