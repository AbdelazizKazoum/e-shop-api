import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { StockMovement } from '../entities/stock-movement.entity';

@Injectable()
export class StockMovementRepository extends AbstractRepository<StockMovement> {
  protected readonly logger = new Logger(StockMovementRepository.name);

  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
  ) {
    super(stockMovementRepository);
  }
}
