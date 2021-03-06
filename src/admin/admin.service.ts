import {
  ForbiddenException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { CaverService } from 'src/caver/caver.service';
import { Admin, PriceInfo } from './admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Approve } from '../user/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(PriceInfo)
    private priceInfoRepository: Repository<PriceInfo>,
    @Inject(forwardRef(() => CaverService))
    private readonly caverService: CaverService,
  ) {}

  async find(options?: FindManyOptions<Admin>): Promise<Admin[]> {
    return this.adminRepository.find(options);
  }

  async findOneByAddress(address: string): Promise<Admin> {
    return this.adminRepository.findOne({ address });
  }

  async getPriceInfo(place: string): Promise<PriceInfo[]> {
    return this.priceInfoRepository.find({
      place,
    });
  }

  async updateCoverImg(address: string, path: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ address });
    admin.cover_img = path;
    return this.adminRepository.save(admin);
  }

  async addPriceInfo(
    place: string,
    month: number,
    klay: number,
  ): Promise<PriceInfo> {
    return this.priceInfoRepository.save({
      place,
      month,
      klay,
    });
  }

  async deletePriceInfo(place: string, month: number): Promise<PriceInfo> {
    const priceInfo = await this.priceInfoRepository.findOne({ place, month });
    return this.priceInfoRepository.remove(priceInfo);
  }

  async updatePriceInfo(
    place: string,
    month: number,
    updateKlay: number,
  ): Promise<PriceInfo> {
    const priceInfo = await this.priceInfoRepository.findOne({ place, month });
    priceInfo.klay = updateKlay;
    return this.priceInfoRepository.save(priceInfo);
  }

  async createAccount(createAdminDto: CreateAdminDto) {
    const isExistByAddress = await this.adminRepository.findOne({
      address: createAdminDto.address,
    });
    if (isExistByAddress) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '?????? ????????? ??????????????????.',
        error: 'Forbidden',
      });
    }

    // const { password, ...result } = createAdminDto;
    // const salt = await bcrypt.genSalt();
    // const bcryptPassword = await bcrypt.hash(password, salt);

    // const keyring = await this.caverService.caver.wallet.keyring.generate();
    await this.adminRepository.save({
      ...createAdminDto,
      cover_img: '/public/default_cover.png',
    });
    return createAdminDto;
  }

  async mint(
    targetAddress: string,
    myAddress: string,
    place: string,
    day: number,
    secretKey: string,
  ) {
    const token = jwt.sign(
      {
        place: place,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().add(day, 'days').format('YYYY-MM-DD'),
      },
      secretKey,
      {
        expiresIn: `${day}d`,
      },
    );

    // from??? ????????? ?????????????????????
    // ?????? ?????? ????????? ?????????
    // ????????? ?????? ??????

    const _mintNFT = await this.caverService.contract.methods
      .mintNFT(myAddress, targetAddress, token)
      .send({
        from: this.caverService.feeKeyring.address,
        gas: 3000000,
        feeDelegation: true,
        feePayer: this.caverService.feeKeyring.address,
      });
    return _mintNFT;
  }
}
