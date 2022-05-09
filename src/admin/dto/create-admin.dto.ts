import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  location: string;

  @IsString()
  @ApiProperty()
  place: string;

  @IsString()
  @ApiProperty()
  nickname: string;

  @IsString()
  @ApiProperty()
  phone: string;
}

export class CreateAdminDtoWithAddress {
  @IsString()
  @ApiProperty()
  location: string;

  @IsString()
  @ApiProperty()
  place: string;

  @IsString()
  @ApiProperty()
  nickname: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  privateKey: string;

  @IsString()
  @ApiProperty()
  phone: string;
}
