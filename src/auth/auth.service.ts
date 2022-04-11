import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDtoWithPrivateKey } from 'src/user/dto/create-user.dto';
import { AdminService } from 'src/admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(wallet: string, privateKey: string): Promise<any> {
    const user = await this.userService.findOneByWallet(wallet);
    if (user) {
      const isMatch = await bcrypt.compare(user.privateKey, privateKey);
      if (isMatch) {
        const { privateKey, ...result } = user;
        return result;
      }
      return false;
    }
    return null;
  }

  async validateAdmin(email: string, password: string): Promise<any> {
    const user = await this.adminService.findOneByEmail(email);

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

  async userLogin(user: CreateUserDtoWithPrivateKey) {
    const { privateKey, ..._user } = user;
    const payload = {
      address: _user.address,
    };
    return {
      access_token: this.jwtService.sign(payload),
      status: 'success',
      ..._user,
    };
  }

  async adminLogin(admin: CreateAdminDto) {
    const { password, ..._admin } = admin;
    const payload = {
      email: _admin.email,
      isAdmin: true,
    };
    return {
      access_token: this.jwtService.sign(payload),
      status: 'success',
      ..._admin,
    };
  }
}
