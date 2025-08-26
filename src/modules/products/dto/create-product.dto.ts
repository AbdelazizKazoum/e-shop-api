import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsString()
  description: string;

  @IsString()
  categoryId: string;

  @IsString()
  gender: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  newPrice?: number;
}
