import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  password: string;
}

export class LoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class UserWithoutPassword {
  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  address: string;
}
