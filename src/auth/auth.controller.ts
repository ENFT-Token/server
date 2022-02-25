import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { KasService } from 'src/kas/kas.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly kasService: KasService,
    private readonly userSevice: UserService,
  ) {}

  @Post('/login')
  login(@Body() user: LoginDto) {
    return this.authService.login(user.email, user.password);
  }

  @Post('/register')
  async register(@Body() user: RegisterDto) {
    const { address } = await this.kasService.createAccount();
    return this.userSevice.create({
      address,
      ...user,
    });
  }

  @Get('/findAccount')
  async findAccount() {
    const response = await this.kasService.findAccount();
    return response;
  }
}
