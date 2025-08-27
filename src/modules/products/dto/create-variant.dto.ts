// src/modules/products/dto/create-variant.dto.ts
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  color: string;

  @IsString()
  size: 'SM' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | '4XL';

  @IsNumber()
  qte: number;

  @IsOptional()
  @IsArray()
  images?: any[]; // These will come as files via multipart/form-data
}
