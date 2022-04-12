import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CheckDto {
  @ApiProperty({
    description: '유저 지갑 주소',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'NFT 토큰',
  })
  @IsString()
  nftToken: string;
}


export class PlaceDto {
  @IsString()
  place: string;
}
