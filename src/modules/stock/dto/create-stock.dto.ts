import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  @IsString()
  variantId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
