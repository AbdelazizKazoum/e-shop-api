import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  StockMovementType,
  StockMovementReason,
} from '../types/stock-movement-type.enum';

export class CreateStockMovementDto {
  @IsUUID()
  @IsNotEmpty()
  variantId: string;

  @IsEnum(StockMovementType)
  @IsNotEmpty()
  type: StockMovementType;

  @Type(() => Number)
  @IsNumber()
  @IsInt()
  quantity: number;

  @IsEnum(StockMovementReason)
  @IsNotEmpty()
  reason: StockMovementReason;

  @IsOptional()
  @IsString()
  supplierId?: string;

  @IsOptional()
  @IsString()
  supplierOrderId?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
