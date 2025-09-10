/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockRepository } from './repositories/stock.repository';
import { Stock } from './entities/stock.entity';
import { EntityManager, In, Like, Between } from 'typeorm';

@Injectable()
export class StockService {
  constructor(private readonly stockRepository: StockRepository) {}

  // ✅ Create new stock
  async create(createStockDto: CreateStockDto): Promise<Stock> {
    return this.stockRepository.create({
      ...createStockDto,
      createAt: new Date().toLocaleDateString(),
      updated: new Date().toLocaleDateString(),
    });
  }

  /**
   * Decreases the stock quantity for a given variant.
   * Designed to be used within a transaction.
   * @param variantId The ID of the variant to update stock for.
   * @param quantityToDecrease The amount to decrease the stock by.
   * @param manager The EntityManager from the current transaction.
   */
  async decreaseStockForVariant(
    variantId: string,
    quantityToDecrease: number,
    manager: EntityManager,
  ): Promise<Stock> {
    const stock = await manager.findOne(Stock, {
      where: { variant: { id: variantId } },
      relations: ['variant'],
    });

    if (!stock) {
      throw new NotFoundException(
        `Stock for variant with ID "${variantId}" not found.`,
      );
    }

    if (stock.quantity < quantityToDecrease) {
      throw new BadRequestException(
        `Insufficient stock for variant "${stock.variant.id}". Available: ${stock.quantity}, Requested: ${quantityToDecrease}`,
      );
    }

    stock.quantity -= quantityToDecrease;
    stock.updated = new Date().toISOString();

    return manager.save(stock);
  }

  /**
   * Retrieves a paginated and filtered list of stocks.
   * @param page - The page number for pagination.
   * @param limit - The number of items per page.
   * @param filters - An object containing filter criteria:
   *   - `productName` (optional): Filter by the name of the product associated with the stock.
   *   - `minQte` (optional): Filter for stock with a quantity greater than or equal to this value.
   *   - `maxQte` (optional): Filter for stock with a quantity less than or equal to this value.
   *   - `sortBy` (optional): Sort the results by 'newest' or 'oldest' creation date.
   * @returns A promise that resolves to an object containing the paginated stock data, total count, page number, and limit.
   */
  async findAllWithFiltersAndPagination(
    page: number = 1,
    limit: number = 10,
    filters: {
      productName?: string;
      minQte?: number;
      maxQte?: number;
      sortBy?: 'newest' | 'oldest';
    },
  ): Promise<{
    data: Stock[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { productName, minQte, maxQte, sortBy } = filters;

    const where: any = {};

    if (productName) {
      where.variant = { product: { name: Like(`%${productName}%`) } };
    }

    if (minQte && maxQte) {
      where.quantity = Between(minQte, maxQte);
    } else if (minQte) {
      where.quantity = Between(minQte, 10000); // Assuming a large enough max value
    } else if (maxQte) {
      where.quantity = Between(0, maxQte);
    }

    const order: any = {};
    if (sortBy === 'newest') {
      order.createAt = 'DESC';
    } else if (sortBy === 'oldest') {
      order.createAt = 'ASC';
    }

    const [data, total] = await this.stockRepository.findAndCountWithPagination(
      {
        where,
        order,
        take: limit,
        skip: (page - 1) * limit,
        relations: ['variant', 'variant.product'],
      },
    );

    return {
      data,
      total,
      page,
      limit,
    };
  }

  // ✅ Get all stocks
  async findAll(): Promise<Stock[]> {
    return this.stockRepository.findAll();
  }

  // ✅ Get one stock by id
  async findOne(id: string): Promise<Stock> {
    const stock = await this.stockRepository.findOne({ id });
    if (!stock) {
      throw new NotFoundException(`Stock with id "${id}" not found`);
    }
    return stock;
  }

  /**
   * Gets the available stock quantity for a specific variant.
   * @param variantId The ID of the variant to check.
   * @returns The available quantity.
   */
  async getStockQuantityByVariant(variantId: string): Promise<number> {
    const stock = await this.stockRepository.findOne({
      variant: { id: variantId },
    });

    if (!stock) {
      throw new NotFoundException(
        `Stock information for variant with ID "${variantId}" not found.`,
      );
    }

    return stock.quantity;
  }

  /**
   * Gets the stock quantities for an array of variant IDs.
   * @param variantIds An array of variant IDs.
   * @returns A map of variantId to its quantity. Variants not found in stock will have a quantity of 0.
   */
  async getQuantitiesForVariants(
    variantIds: string[],
  ): Promise<Record<string, number>> {
    if (!variantIds || variantIds.length === 0) {
      return {};
    }

    // Assuming the custom repository can handle a TypeORM 'find' query
    const stocks = await this.stockRepository.findAll({
      where: {
        variant: {
          id: In(variantIds),
        },
      },
      relations: ['variant'],
    });

    // Create a map to hold the results, initializing all requested variants with 0
    const quantityMap: Record<string, number> = {};
    variantIds.forEach((id) => {
      quantityMap[id] = 0; // Default to 0 if no stock record is found
    });

    // Populate the map with the actual quantities found in the database
    stocks.forEach((stock) => {
      if (stock.variant && stock.variant.id) {
        quantityMap[stock.variant.id] = stock.quantity;
      }
    });

    return quantityMap;
  }

  // ✅ Update stock by id
  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    return this.stockRepository.findOneAndUpdate(
      { id },
      { ...updateStockDto, updated: new Date().toLocaleDateString() },
    );
  }

  // ✅ Delete stock by id
  async remove(id: string): Promise<void> {
    return this.stockRepository.findOneAndDelete({ id });
  }
}
