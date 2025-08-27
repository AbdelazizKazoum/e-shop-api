/* eslint-disable prettier/prettier */
// src/products/dto/update-product.dto.ts
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  newPrice?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'archived'])
  status?: 'active' | 'inactive' | 'archived';

  @IsOptional()
  @IsBoolean()
  trending?: boolean;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
