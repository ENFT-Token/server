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
    const { password, ..._user } = user;
    const payload = {
      email: _user.email,
      isAdmin: _user.isAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
      status: 'success',
      ..._user,
      profileImg: 'http://placeimg.com/640/480/any',
      phone: '010-5629-1265', // TODO: 더미 데이터 나중에 SQL로 바꿀거임.
    };
  }
}
