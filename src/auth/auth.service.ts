import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (user) {
      const isMatch = await bcrypt.compare(user.password, password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...payload } = user;
        return {
          access_token: this.jwtService.sign(payload),
          address: payload.address,
          status: 'success',
        };
      }
      throw new UnauthorizedException('Invalid password.');
    }
    throw new UnauthorizedException('Invalid email.');
  }
}
