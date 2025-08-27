// src/products/dto/update-variant.dto.ts
import { IsOptional, IsString, IsNumber, IsIn, IsArray } from 'class-validator';

const SIZES = ['SM', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'] as const;
type Size = (typeof SIZES)[number];

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsIn(SIZES)
  size?: Size;

  @IsOptional()
  @IsNumber()
  qte?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageIdsToDelete?: string[];
}
