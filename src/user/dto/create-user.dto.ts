import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  nickname: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  location: string;

  @IsBoolean()
  @ApiProperty()
  isAdmin: boolean;
}

export class UserNicknameDto {
  @IsString()
  @ApiProperty()
  nickname: string;
}

export class UserEmailDto {
  @IsString()
  @ApiProperty()
  email: string;
}
