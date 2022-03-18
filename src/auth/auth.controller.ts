import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { CaverService } from 'src/caver/caver.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from 'src/admin/admin.service';

@Controller('auth')
@ApiTags('유저 API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly userSevice: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: '로그인 API' })
  @ApiBody({ type: LoginDto })
  login(@Req() req) {
    console.log('/login', req.user);
    return this.authService.login(req.user);
  }

  @Post('/register')
  @ApiOperation({ summary: '회원가입 API' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() user: CreateUserDto) {
    console.log(user);
    const _user = await this.userSevice.create({
      ...user,
    });

    return _user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/findAccount')
  async findAccount() {
    const response = await this.userSevice;
    return response;
  }
}
