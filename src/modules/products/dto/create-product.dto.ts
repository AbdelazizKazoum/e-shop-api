import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  brand: string; // brand id

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
