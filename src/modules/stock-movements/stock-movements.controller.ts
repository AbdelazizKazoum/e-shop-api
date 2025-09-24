import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  async create(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.create(createStockMovementDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('reason') reason?: string,
    @Query('variantId') variantId?: string,
    @Query('supplierId') supplierId?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.stockMovementsService.findAll({
      page,
      limit,
      type,
      reason,
      variantId,
      supplierId,
      userId,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stockMovementsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStockMovementDto: UpdateStockMovementDto,
  ) {
    return this.stockMovementsService.update(id, updateStockMovementDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.stockMovementsService.remove(id);
  }
}
