import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import jwt from 'jsonwebtoken';

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

  async check(address: string, nftToken: string) {
    try {
      const { place } = jwt.decode(nftToken) as { place: string };
      const admin = await this.adminRepository.findOne({
        relations: ['user'],
        where: {
          place,
        },
      });
      const result = jwt.verify(nftToken, admin.privateKey); // NFT 검증

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
