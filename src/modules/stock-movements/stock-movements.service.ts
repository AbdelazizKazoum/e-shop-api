import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { StockMovementRepository } from './repositories/stock-movement.repository';

@Injectable()
export class StockMovementsService {
  constructor(
    private readonly stockMovementRepository: StockMovementRepository,
  ) {}

  async create(createStockMovementDto: CreateStockMovementDto) {
    return await this.stockMovementRepository.create({
      ...createStockMovementDto,
      productDetail: { id: createStockMovementDto.variantId },
      supplier: createStockMovementDto.supplierId
        ? { id: createStockMovementDto.supplierId }
        : null,
      supplierOrder: createStockMovementDto.supplierOrderId
        ? { id: createStockMovementDto.supplierOrderId }
        : null,
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
    return this.stockMovementRepository.findOneAndUpdate(
      { id },
      updateStockMovementDto,
    );
  }

  async remove(id: string) {
    await this.stockMovementRepository.findOneAndDelete({ id });
    return { message: 'Stock movement deleted successfully' };
  }
}
