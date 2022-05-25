import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TransferNftDto {
  @IsString()
  @ApiProperty()
  to: string;

  @IsString()
  @ApiProperty()
  nft: string;
}
