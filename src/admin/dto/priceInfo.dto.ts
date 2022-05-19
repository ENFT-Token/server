import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PriceInfoDto {
  @IsNumber()
  month: number;

  @IsNumber()
  @IsOptional()
  klay: number;
}
