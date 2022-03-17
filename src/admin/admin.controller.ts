import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface IUser {
  email: string;
  nickname: string;
}

@Controller('admin')
export class AdminController {
  constructor(private readonly jwtService: JwtService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/mint')
  async _mint(@Req() { user }: { user: IUser }) {
    console.log('ASD', user);
    return user;
  }
}
