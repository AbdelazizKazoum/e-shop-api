import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsString()
  description: string;

  @IsString()
  category: Category;

  @IsString()
  gender: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  newPrice?: number;
}
