import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserLocalAuthGuard, AdminLocalAuthGuard } from './local-auth.guard';
import { CaverService } from 'src/caver/caver.service';
import { CreateUserDto, UserAddressDto } from 'src/user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from 'src/admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';

@Controller('auth')
@ApiTags('유저 API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly userSevice: UserService,
  ) {}

  @UseGuards(AdminLocalAuthGuard)
  @Post('/admin/login')
  @ApiOperation({ summary: '로그인 API' })
  @ApiBody({ type: CreateAdminDto })
  adminLogin(@Req() req) {
    console.log('/admin/login', req.user);
    return this.authService.adminLogin(req.user);
  }

  @Post('/admin/register')
  @ApiOperation({ summary: '어드민 회원가입 API' })
  @ApiBody({ type: CreateAdminDto })
  async adminRegister(@Body() user: CreateAdminDto) {
    console.log(user);
    const _user = await this.adminService.createAccount({
      ...user,
    });
    return _user;
  }

  @UseGuards(UserLocalAuthGuard)
  @Post('/user/login')
  @ApiOperation({ summary: '어드민 로그인 API' })
  @ApiBody({ type: LoginDto })
  userLogin(@Req() req) {
    console.log('/user/login', req.user);
    return this.authService.userLogin(req.user);
  }

  @Post('/user/register')
  @ApiOperation({
    summary:
      '유저 회원가입 API, Response값으로 privateKey 넘어오는데 해당 값은 bcrypt로 암호화해서 저장해놓기.',
  })
  @ApiBody({ type: CreateUserDto })
  async userRegister(@Body() user: CreateUserDto) {
    console.log(user);
    const _user = await this.userSevice.createAccount({
      ...user,
    });
    return _user;
  }

  @Get('/user/alreadyAccount')
  @ApiOperation({
    summary: '클립 연동 시 이미 계정이 있다면 기존 privateKey 반환',
  })
  @ApiBody({ type: CreateUserDto })
  async alreadyAccount(@Query() user: UserAddressDto) {
    const _user = await this.userSevice.alreadyAccount(user.address);
    return _user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/findAccount')
  async findAccount() {
    const response = await this.userSevice;
    return response;
  }
}
