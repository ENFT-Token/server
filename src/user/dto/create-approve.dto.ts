import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateApproveDtoWithAddress {
  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  requestPlace: string;

  @IsNumber()
  @ApiProperty()
  requestDay: number;
}

export class CreateApproveDto {
  @IsString()
  @ApiProperty()
  requestPlace: string;

  @IsNumber()
  @ApiProperty()
  requestDay: number;
}
