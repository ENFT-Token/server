import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/admin_user/admin_user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/admin_user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return false;
    }
    return null;
  }

  async login(user: CreateUserDto) {
    const payload = {
      email: user.email,
      address: user.address,
      nickname: user.nickname,
    };
    return {
      access_token: this.jwtService.sign(payload),
      address: user.address,
      status: 'success',
    };
  }
}
