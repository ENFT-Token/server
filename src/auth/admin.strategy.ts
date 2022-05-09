import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'address',
      passwordField: 'address',
    });
  }

  async validate(address: string, password: string): Promise<any> {
    console.log(address, password);
    const user = await this.authService.validateAdmin(address);
    if (!user) {
      throw new UnauthorizedException('Invalid address.');
    }
    return user;
  }
}
