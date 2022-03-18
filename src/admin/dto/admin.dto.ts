import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MintDto {
  @ApiProperty()
  @IsString()
  target: string;

  @ApiProperty({
    description: '발급할 날짜 ex {day: 30} => 30일 발급',
  })
  @IsNumber()
  day: number;
}
