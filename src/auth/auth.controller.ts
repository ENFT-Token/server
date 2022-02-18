import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  postLogin(@Req() req) {
    const status = this.authService.login() ? 'succ' : 'fail';
    return {
      status,
      user: req.user,
      publicKey: 'TEST_KEY',
    };
  }
}
