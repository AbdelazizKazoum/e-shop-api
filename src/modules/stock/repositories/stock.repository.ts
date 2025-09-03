/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';

@Injectable()
export class StockRepository extends AbstractRepository<Stock> {
  protected readonly logger = new Logger(StockRepository.name);
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {
    super(stockRepository);
  }
}
