import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

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
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

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
