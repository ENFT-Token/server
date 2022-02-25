import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { KasService } from 'src/kas/kas.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly kasService: KasService,
    private readonly userSevice: UserService,
  ) {}

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

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userSevice.create(createUserDto);
  }
  @Post('/createAccount')
  async createAccount(@Req() req) {
    const response = await this.kasService.createAccount();
    console.log(response);
    return response;
  }

  @Get('/findAccount')
  async findAccount(@Req() req) {
    const response = await this.kasService.findAccount();
    console.log(response);
    return response;
  }
}
