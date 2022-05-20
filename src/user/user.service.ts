import {
  ForbiddenException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateUserDto, UserNicknameDto } from './dto/create-user.dto';
import { Approve, User } from './user.entity';
import { CaverService } from 'src/caver/caver.service';
import { CreateApproveDtoWithAddress } from './dto/create-approve.dto';
import { Admin, PriceInfo } from '../admin/admin.entity';
import fs from 'fs/promises';
import path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Approve)
    private approveRepository: Repository<Approve>,
    @InjectRepository(PriceInfo)
    private priceInfoRepository: Repository<PriceInfo>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @Inject(forwardRef(() => CaverService))
    private caverService: CaverService,
  ) {}

  async findAllPriceInfo() {
    const priceInfos: any = await this.priceInfoRepository
      .createQueryBuilder('priceInfo')
      .leftJoinAndMapOne(
        'priceInfo.admin',
        Admin,
        'admin',
        'admin.place = priceInfo.place',
      )
      .select([
        'priceInfo.place',
        'priceInfo.month',
        'priceInfo.klay',
        'admin.cover_img',
      ])
      .getMany();

    return priceInfos.reduce(
      (result, elem) => ({
        ...result,
        [elem.place]: [
          ...(result[elem.place] ?? []),
          {
            month: elem.month,
            klay: elem.klay,
            cover_img: elem.admin.cover_img,
          },
        ],
      }),
      {},
    );
  }

  async findOneByWallet(address: string): Promise<User> {
    return this.userRepository.findOne({ address });
  }
  findApprove(place: string): Promise<Approve[]> {
    return this.approveRepository
      .createQueryBuilder('approve')
      .where('approve.requestPlace = :place', { place })
      .leftJoinAndMapOne(
        'approve.user',
        User,
        'user',
        'user.address = approve.address',
      )
      .select([
        'approve.requestPlace',
        'approve.requestDay',
        'approve.address',
        'user.nickname',
        'user.location',
        'user.sex',
        'user.profile',
      ])
      .getMany();
  }

  async dupCheckNickName(
    findNickname: UserNicknameDto,
  ): Promise<{ usable: boolean; message: string }> {
    const { nickname } = findNickname;
    const isExist = await this.userRepository.findOne({ nickname });
    if (isExist) {
      return {
        usable: false,
        message: '등록된 닉네임 입니다.',
      };
    } else {
      return {
        usable: true,
        message: '사용 가능한 닉네임 입니다.',
      };
    }
  }

  async findByNickName(nickname: string): Promise<User> {
    const user = await this.userRepository.findOne({ nickname });
    return user;
  }

  async requestApprove(createApproveDto: CreateApproveDtoWithAddress) {
    const isPlace = await this.adminRepository.findOne({
      place: createApproveDto.requestPlace,
    });
    if (!isPlace)
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '지원하지 않는 장소입니다.',
        error: 'Forbidden',
      });
    const approveList = await this.approveRepository.find({
      address: createApproveDto.address,
    });
    for (const approve of approveList) {
      if (approve.requestPlace === createApproveDto.requestPlace) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: '이미 신청한 장소입니다.',
          error: 'Forbidden',
        });
      }
    }
    await this.approveRepository.save(createApproveDto);
  }

  async approveComplete(createApproveDto: CreateApproveDtoWithAddress) {
    await this.approveRepository.delete(createApproveDto);
  }

  async alreadyAccount(address: string) {
    const account = await this.userRepository.findOne({
      address,
    });
    if (account) {
      return {
        privateKey: account.privateKey,
      };
    }
    return {
      privateKey: '',
    };
  }

  async findAllPlaceList() {
    return this.adminRepository.find({
      select: ['place'],
    });
  }

  async createAccount(createUserDto: CreateUserDto) {
    const isExistByNickname = await this.userRepository.findOne({
      nickname: createUserDto.nickname,
    });
    if (isExistByNickname) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '이미 등록된 사용자입니다.',
        error: 'Forbidden',
      });
    }
    const privateKey = this.caverService.caver.wallet.keyring.generateSingleKey(
      createUserDto.address,
    );
    const { profile, ..._user } = createUserDto;
    await this.userRepository.save({
      ...createUserDto,
      profile: profile ? profile : '/public/default_profile.png',
      privateKey,
    });
    return {
      privateKey,
    };
  }

  async find(options?: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(options);
  }
}
