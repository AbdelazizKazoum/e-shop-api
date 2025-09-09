/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { GetQuantitiesDto } from './dto/get-quantities.dto';

// DTO for validating the request body when getting quantities for multiple variants

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  async create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  async findAll() {
    return this.stockService.findAll();
  }

  // ✅ New route to get stock for an array of variant IDs via POST
  @Post('quantities-by-variants')
  @HttpCode(HttpStatus.OK)
  async getQuantitiesForVariants(@Body() getQuantitiesDto: GetQuantitiesDto) {
    return this.stockService.getQuantitiesForVariants(
      getQuantitiesDto.variantIds,
    );
  }

  // ✅ Route to get stock for a single variant by its ID
  @Get('variant/:variantId')
  async getQuantityByVariant(@Param('variantId') variantId: string) {
    const quantity =
      await this.stockService.getStockQuantityByVariant(variantId);
    return { variantId, quantity };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }
}
