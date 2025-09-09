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
import { EntityManager } from 'typeorm';

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
    // Use the transaction's manager to find the stock
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
    stock.updated = new Date().toISOString(); // Use ISO string for consistency

    // Use the transaction's manager to save the change
    return manager.save(stock);
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
