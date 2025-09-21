/* eslint-disable prettier/prettier */
import {
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number; // 1 to 5

  @IsString()
  @IsNotEmpty()
  comment: string;
}
