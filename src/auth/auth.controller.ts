import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  postLogin() {
    const status = this.authService.login() ? 'succ' : 'fail';
    return {
      status,
      publicKey: 'TEST_KEY',
    };
  }
}
