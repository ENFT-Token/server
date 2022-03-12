import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/admin_user/admin_user.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { CaverService } from 'src/caver/caver.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly CaverService: CaverService,
    private readonly userSevice: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req) {
    console.log('/login', req.user);
    return this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() user: RegisterDto) {
    const [address] = await this.CaverService.caver.wallet.generate(1);
    return this.userSevice.create({
      address,
      ...user,
    });
  }
  @UseGuards(JwtAuthGuard)
  @Get('/findAccount')
  async findAccount() {
    const response = await this.userSevice;
    return response;
  }
}
