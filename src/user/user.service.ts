import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Raw, Repository } from 'typeorm';
import { CreateUserDto, UserNicknameDto } from './dto/create-user.dto';
import { Approve, User } from './user.entity';
import { CaverService } from 'src/caver/caver.service';
import { CreateApproveDtoWithAddress } from './dto/create-approve.dto';
import { Admin, PriceInfo } from '../admin/admin.entity';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

import { TransferNftDto } from './dto/transfer.dto';

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

  async addressToUsers(address: string[]) {
    console.log(address);
    if (address.length === 0) return [];
    return await this.userRepository.find({
      where: {
        address: Raw((alias) =>
          address.map((v) => `address = '${v}'`).join(' OR '),
        ),
      },
      select: ['address', 'location', 'profile', 'nickname', 'sex'],
    });
  }

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
        'admin.location',
        'admin.address',
      ])
      .getMany();

    const transData = priceInfos.reduce(
      (result, elem) => ({
        ...result,
        [elem.place]: {
          address: elem.admin?.address,
          location: elem.admin?.location,
          cover_img: elem.admin?.cover_img,
          list: [
            ...(result[elem.place]?.list ?? []),
            {
              month: elem.month,
              klay: elem.klay,
            },
          ],
        },
      }),
      {},
    );

    return Object.entries(transData).map((v) => ({
      place: v[0],
      ...(v[1] as any),
    }));
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
        message: '????????? ????????? ?????????.',
      };
    } else {
      return {
        usable: true,
        message: '?????? ????????? ????????? ?????????.',
      };
    }
  }

  async findByNickName(nickname: string): Promise<User> {
    const user = await this.userRepository.findOne({ nickname });
    return user;
  }

  async findProfile(profile: string){
    const user = await this.userRepository.findOne({nickname:profile});
    return user.profile;
  }

  async findByAddress(address: string): Promise<User> {
    const user = await this.userRepository.findOne({ address });
    return user;
  }

  async changeLocation(location: string, user: User){
    user.location = location;
    this.userRepository.save(user);
    return user;
  }

  async requestApprove(createApproveDto: CreateApproveDtoWithAddress) {
    const isPlace = await this.adminRepository.findOne({
      place: createApproveDto.requestPlace,
    });
    if (!isPlace)
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '???????????? ?????? ???????????????.',
        error: 'Forbidden',
      });
    const approveList = await this.approveRepository.find({
      address: createApproveDto.address,
    });
    for (const approve of approveList) {
      if (approve.requestPlace === createApproveDto.requestPlace) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: '?????? ????????? ???????????????.',
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
        message: '?????? ????????? ??????????????????.',
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

  async transferNFT(userAddress: string, transferNftDto: TransferNftDto) {
    const { to, nft } = transferNftDto;
    const { place } = jwt.decode(nft) as Record<string, any>;
    const { address: adminAddress } = await this.adminRepository.findOne({
      place,
    });

    const owner = await this.caverService.contract.methods
      .ownerByMember(adminAddress)
      .call();

    let flag = false;
    for (let i = 0; i < owner.length; i++) {
      if (owner[i] == userAddress) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'from ????????? ??????????????? ???????????? ????????????.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const balanceOf = await this.caverService.contract.methods
      .balanceOf(userAddress)
      .call();

    let findNftId = -1;
    for (let i = 0; i < balanceOf; i++) {
      const tokenIdx = await this.caverService.contract.methods
        .tokenOfOwnerByIndex(userAddress, i)
        .call();
      const findNft = await this.caverService.contract.methods
        .tokenURI(tokenIdx)
        .call();
      if (findNft === nft) {
        findNftId = tokenIdx;
        break;
      }
    }
    if (findNftId != -1) {
      return await this.caverService.contract.methods
        .transferNFT(adminAddress, userAddress, to, findNftId)
        .send({
          from: this.caverService.feeKeyring.address,
          gas: 3000000,
          feeDelegation: true,
          feePayer: this.caverService.feeKeyring.address,
        });
    }
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: '?????? ??????',
      },
      HttpStatus.FORBIDDEN,
    );
  }

  async burnNFT(userAddress: string, nft: string) {
    const { place } = jwt.decode(nft) as Record<string, any>;
    const { address: adminAddress } = await this.adminRepository.findOne({
      place,
    });

    const balanceOf = await this.caverService.contract.methods
      .balanceOf(userAddress)
      .call();

    let findNftId = -1;
    for (let i = 0; i < balanceOf; i++) {
      const tokenIdx = await this.caverService.contract.methods
        .tokenOfOwnerByIndex(userAddress, i)
        .call();
      const findNft = await this.caverService.contract.methods
        .tokenURI(tokenIdx)
        .call();
      if (findNft === nft) {
        findNftId = tokenIdx;
        break;
      }
    }
    if (findNftId != -1) {
      return await this.caverService.contract.methods
        .burnNFT(adminAddress, userAddress, findNftId)
        .send({
          from: this.caverService.feeKeyring.address,
          gas: 3000000,
          feeDelegation: true,
          feePayer: this.caverService.feeKeyring.address,
        });
    }
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: '?????? ??????',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
