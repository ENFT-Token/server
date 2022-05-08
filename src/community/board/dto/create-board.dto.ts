import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsString()
  @ApiProperty()
  location: string;
}
