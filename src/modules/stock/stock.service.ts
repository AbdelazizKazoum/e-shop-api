/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockRepository } from './repositories/stock.repository';
import { Stock } from './entities/stock.entity';

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
