import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { CaverService } from 'src/caver/caver.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('유저 API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly CaverService: CaverService,
    private readonly userSevice: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({summary: '로그인 API'})
  @ApiBody({type:LoginDto})
  login(@Req() req) {
    console.log('/login', req.user);
    return this.authService.login(req.user);
  }

  @Post('/register')
  @ApiOperation({summary: '회원가입 API'})
  @ApiBody({type:CreateUserDto})
  async register(@Body() user:CreateUserDto) {
    
    return this.userSevice.create({
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
