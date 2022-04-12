import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'address',
      passwordField: 'privateKey',
    });
  }

  async validate(address: string, privateKey: string): Promise<any> {
    const user = await this.authService.validateUser(address, privateKey);
    if (user == null) {
      throw new UnauthorizedException('Invalid address.');
    } else if (user === false) {
      throw new UnauthorizedException('Invalid privateKey.');
    }
    return user;
  }
}
