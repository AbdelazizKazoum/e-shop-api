import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class GetQuantitiesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  variantIds: string[];
}
