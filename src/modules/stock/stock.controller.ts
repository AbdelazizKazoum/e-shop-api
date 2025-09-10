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
  Query,
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

  /**
   * Retrieves a paginated and filtered list of stocks.
   * @param page - The page number for pagination (default: 1).
   * @param limit - The number of items per page (default: 10).
   * @param productName - Filter by the name of the product.
   * @param minQte - Filter for stock with a minimum quantity.
   * @param maxQte - Filter for stock with a maximum quantity.
   * @param sortBy - Sort the results by 'newest' or 'oldest' creation date.
   * @returns A paginated list of stocks based on the provided filters.
   */
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('productName') productName?: string,
    @Query('minQte') minQte?: number,
    @Query('maxQte') maxQte?: number,
    @Query('sortBy') sortBy?: 'newest' | 'oldest',
  ) {
    const filters = { productName, minQte, maxQte, sortBy };
    // Convert minQte and maxQte to numbers if they exist
    if (filters.minQte) {
      filters.minQte = Number(filters.minQte);
    }
    if (filters.maxQte) {
      filters.maxQte = Number(filters.maxQte);
    }
    return this.stockService.findAllWithFiltersAndPagination(
      page,
      limit,
      filters,
    );
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
