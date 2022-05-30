import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Admin, TodayCount } from '../admin/admin.entity';
import jwt, { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(TodayCount)
    private todayCountRepository: Repository<TodayCount>,
  ) {}

  async allCheckInUser(place: string) {
    const admin = await this.adminRepository.findOne({
      relations: ['user'],
      where: {
        place,
      },
    });
    return admin?.user ?? [];
  }
  async count(place: string) {
    const admin = await this.adminRepository.findOne({
      relations: ['user'],
      where: {
        place,
      },
    });
    return admin?.user?.length ?? 0;
  }

  async todayCount(place: string) {
    const today = await this.todayCountRepository.findOne({
      date: moment().format('yyyy-MM-DD'),
      place: place,
    });
    return today?.count ? today.count : 0;
  }

  isCheckIn(checkUser: User[], address: string) {
    const idx = checkUser.findIndex((user) => user.address === address);
    return idx === -1 ? false : true;
  }

  async checkIn(admin: Admin, address: string) {
    const user = await this.userRepository.findOne({ address });
    if (!admin?.user) admin.user = [];
    user.updateAt = new Date();
    this.userRepository.save(user);
    admin.user.push(user);
    await this.adminRepository.save(admin);

    // 하루 누적 계산
    const today = await this.todayCountRepository.findOne({
      date: moment().format('yyyy-MM-DD'),
      place: admin.place,
    });
    if (today) {
      today.count += 1;
      await this.todayCountRepository.save(today);
    } else {
      await this.todayCountRepository.save({
        place: admin.place,
        date: moment().format('yyyy-MM-DD'),
        count: 1,
      });
    }
  }

  async checkOut(admin: Admin, address: string) {
    if (admin.user)
      admin.user = admin.user?.filter((user) => user.address !== address);
    await this.adminRepository.save(admin);
  }

  async check(adminAddress: string, address: string, nftToken: string) {
    try {
      const admin = await this.adminRepository.findOne({
        relations: ['user'],
        where: {
          address: adminAddress,
        },
      });
      const result = jwt.verify(nftToken, admin.address) as JwtPayload; // NFT 검증

      if (!admin || admin?.place !== result?.place) {
        throw new UnauthorizedException(
          'Invalid NFT Token: 이용권의 위치와 사용하려는 위치가 일치하지 않습니다.',
        );
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
