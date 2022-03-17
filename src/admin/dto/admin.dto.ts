import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MintDto {
  @ApiProperty()
  @IsString()
  target: string;
}
