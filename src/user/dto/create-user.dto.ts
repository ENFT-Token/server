import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  nickname: string;

  @IsString()
  @ApiProperty()
  location: string;

  @IsString()
  @ApiProperty()
  profile: string;

  @IsString()
  @ApiProperty()
  sex: string;
}


export class CreateUserDtoWithPrivateKey {
  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  privateKey: string;

  @IsString()
  @ApiProperty()
  nickname: string;

  @IsString()
  @ApiProperty()
  location: string;

  @IsString()
  @ApiProperty()
  profile: string;

  @IsString()
  @ApiProperty()
  sex: string;
}


export class UserNicknameDto {
  @IsString()
  @ApiProperty()
  nickname: string;
}

export class UserAddressDto {
  @IsString()
  @ApiProperty()
  address: string;
}

