import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import {
  CreateUserDto,
  UserEmailDto,
  UserNicknameDto,
} from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Wallet } from 'src/user/user.entity';
import { CaverService } from 'src/caver/caver.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private caverService: CaverService,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async findEmail(
    findEmail: UserEmailDto,
  ): Promise<{ usable: boolean; message: string }> {
    const { email } = findEmail;
    const isExist = await this.userRepository.findOne({ email });
    if (isExist) {
      return {
        usable: false,
        message: '등록된 이메일 입니다.',
      };
    } else {
      return {
        usable: true,
        message: '사용 가능한 이메일 입니다.',
      };
    }
  }

  async findNickname(
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

  async create(createUserDto: CreateUserDto) {
    const isExistByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (isExistByEmail) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '이미 등록된 사용자입니다.',
        error: 'Forbidden',
      });
    }
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
    const { password, ...result } = createUserDto;
    const salt = await bcrypt.genSalt();
    const bcryptPassword = await bcrypt.hash(password, salt);

    const wallet: Wallet = new Wallet();
    wallet.email = result.email;
    wallet.address = null;
    if (result.isAdmin) {
      wallet.address = this.caverService.caver.wallet.generate(1)[0];
    }
    await this.walletRepository.save(wallet);

    await this.userRepository.save({
      password: bcryptPassword,
      ...result,
      wallet,
    });
    return result;
  }
  async find(options?: FindManyOptions<User>) {
    return this.userRepository.find(options);
  }
}
