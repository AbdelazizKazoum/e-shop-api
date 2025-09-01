/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsOptional()
  // @IsString()
  // username: string;

  @IsOptional()
  @IsString()
  password: string;

  //   @IsOptional()
  //   @IsEnum(['admin', 'client'])
  //   role: 'admin' | 'client';

  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  //   @IsOptional()
  //   @IsString()
  //   identity_number?: string;

  //   @IsOptional()
  //   @IsString()
  //   country?: string;

  @IsOptional()
  tel: number;

  @IsOptional()
  @Type(() => Date)
  date_inscription?: Date;

  @IsOptional()
  image: string;

  @IsOptional()
  isProfileComplete?: boolean;
}
