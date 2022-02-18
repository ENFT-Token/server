import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'user_id',
      passwordField: 'user_pw',
    });
  }

  async validate(user_id: string, user_pw: string): Promise<any> {
    console.log('LocalStrategy');

    const user = await this.authService.validateUser(user_id, user_pw);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
