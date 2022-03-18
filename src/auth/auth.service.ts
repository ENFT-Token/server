import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

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
      nickname: user.nickname,
      isAdmin: user.isAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
      status: 'success',
    };
  }
}
