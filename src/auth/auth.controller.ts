import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { KasService } from 'src/kas/kas.service';
import { CreateUserDto } from 'src/admin_user/dto/create-user.dto';
import { UserService } from 'src/admin_user/admin_user.service';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly kasService: KasService,
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
    const { address } = await this.kasService.createAccount();
    return this.userSevice.create({
      address,
      ...user,
    });
  }
  @UseGuards(JwtAuthGuard)
  @Get('/findAccount')
  async findAccount() {
    const response = await this.kasService.findAccount();
    return response;
  }
}
