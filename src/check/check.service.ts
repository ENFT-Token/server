import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import jwt, { JwtPayload } from "jsonwebtoken";

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async count(place: string) {
    const admin = await this.adminRepository.findOne({
      relations: ['user'],
      where: {
        place,
      },
    });
    return admin?.user?.length ?? 0;
  }

  isCheckIn(checkUser: User[], address: string) {
    const idx = checkUser.findIndex((user) => user.address === address);
    return idx === -1 ? false : true;
  }

  async checkIn(admin: Admin, address: string) {
    const user = await this.userRepository.findOne({ address });
    if (!admin?.user) admin.user = [];
    admin.user.push(user);
    await this.adminRepository.save(admin);
  }

  async checkOut(admin: Admin, address: string) {
    if (admin.user)
      admin.user = admin.user?.filter((user) => user.address !== address);
    await this.adminRepository.save(admin);
  }

  async check(adminEmail: string, address: string, nftToken: string) {
    try {
      const admin = await this.adminRepository.findOne({
        relations: ['user'],
        where: {
          email: adminEmail,
        },
      });
      const result = jwt.verify(nftToken, admin.privateKey) as JwtPayload; // NFT 검증

      if (!admin || admin?.place !== result?.place) {
        throw new UnauthorizedException('Invalid NFT Token: 이용권의 위치와 사용하려는 위치가 일치하지 않습니다.');
      }
      if (!this.isCheckIn(admin.user, address)) {
        // CheckIn
        this.checkIn(admin, address);
        return {
          status: 'checkin',
          ...(result as jwt.JwtPayload),
        };
      } else {
        // CheckOut
        this.checkOut(admin, address);
        return {
          status: 'checkout',
          ...(result as jwt.JwtPayload),
        };
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid NFT Token: ' + e);
    }
  }
}
