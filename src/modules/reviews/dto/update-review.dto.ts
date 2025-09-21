/* eslint-disable prettier/prettier */
import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  title?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number; // 1 to 5

  @IsString()
  @IsOptional()
  comment?: string;
}
