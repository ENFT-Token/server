import { IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  password: string;

  @IsString()
  location: string;

  @IsBoolean()
  isAdmin: boolean;
}
