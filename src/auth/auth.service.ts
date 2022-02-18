import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(): boolean {
    return true;
  }

  async validateUser(user_id: string, user_pw: string): Promise<any> {
    console.log('AuthService');

    const user = {
      user_id: 'test',
      user_pw: '1234',
    };

    if (user && user.user_pw === user_pw) {
      const { user_pw, ...result } = user;
      return result;
    }
    return null;
  }
}
