import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { StockMovementRepository } from './repositories/stock-movement.repository';
import { DataSource } from 'typeorm';
import { StockMovementType } from './types/stock-movement-type.enum';
import { Stock } from '../stock/entities/stock.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Injectable()
export class StockMovementsService {
  constructor(
    private readonly stockMovementRepository: StockMovementRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(createStockMovementDto: CreateStockMovementDto) {
    const { variantId, type, quantity } = createStockMovementDto;

    return this.dataSource.transaction(async (manager) => {
      // 1. Find the stock for the variant
      const stock = await manager.findOne(Stock, {
        where: { variant: { id: variantId } },
      });

      if (!stock) {
        throw new NotFoundException(
          `Stock for variant with ID "${variantId}" not found.`,
        );
      }

      // 2. Update stock quantity based on movement type
      switch (type) {
        case StockMovementType.ADD:
          stock.quantity += quantity;
          break;
        case StockMovementType.REMOVE:
          if (stock.quantity < quantity) {
            throw new BadRequestException(
              `Insufficient stock. Available: ${stock.quantity}, Requested to remove: ${quantity}`,
            );
          }
          stock.quantity -= quantity;
          break;
        case StockMovementType.CORRECTION:
          stock.quantity = quantity;
          break;
        default:
          throw new BadRequestException(`Invalid stock movement type: ${type}`);
      }

      await manager.save(stock);

      // 3. Create and save the stock movement record
      const movement = manager.create(StockMovement, {
        ...createStockMovementDto,
        productDetail: { id: createStockMovementDto.variantId },
        supplier: createStockMovementDto.supplierId
          ? { id: createStockMovementDto.supplierId }
          : null,
        supplierOrder: createStockMovementDto.supplierOrderId
          ? { id: createStockMovementDto.supplierOrderId }
          : null,
      });

      return manager.save(movement);
    });
  }

  /**
   * Find all stock movements with optional filters and pagination.
   * Filters: type, reason, variantId, supplierId, userId, date range.
   */
  async findAll(query: {
    page?: number;
    limit?: number;
    type?: string;
    reason?: string;
    variantId?: string;
    supplierId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      type,
      reason,
      variantId,
      supplierId,
      userId,
      startDate,
      endDate,
    } = query;

    const where: any = {};

    if (type) where.type = type;
    if (reason) where.reason = reason;
    if (variantId) where.productDetail = { id: variantId };
    if (supplierId) where.supplier = { id: supplierId };
    if (userId) where.user = { id: userId };

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt['$gte'] = new Date(startDate);
      if (endDate) where.createdAt['$lte'] = new Date(endDate);
    }

    const [data, total] =
      await this.stockMovementRepository.findAndCountWithPagination({
        where,
        relations: [
          'productDetail',
          'supplier',
          'supplierOrder',
          'user',
          'productDetail.product',
        ],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: string) {
    const movement = await this.stockMovementRepository.findOne(
      { id },
      { relations: ['productDetail', 'supplier', 'supplierOrder', 'user'] },
    );
    if (!movement) throw new NotFoundException('Stock movement not found');
    return movement;
  }

  async update(id: string, updateStockMovementDto: UpdateStockMovementDto) {
    const movement = await this.stockMovementRepository.findOne({ id });
    if (!movement) throw new NotFoundException('Stock movement not found');
    // Note: Updating a movement does not automatically revert/change stock.
    // This would require more complex logic.
    return this.stockMovementRepository.findOneAndUpdate(
      { id },
      updateStockMovementDto,
    );
  }

  async remove(id: string) {
    // Note: Deleting a movement does not automatically revert stock changes.
    // This would require more complex logic.
    await this.stockMovementRepository.findOneAndDelete({ id });
    return { message: 'Stock movement deleted successfully' };
  }
}
