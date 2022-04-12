import {
  ForbiddenException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';
import { CreateUserDto, UserNicknameDto } from './dto/create-user.dto';
import { Approve, User } from './user.entity';
import { CaverService } from 'src/caver/caver.service';
import { CreateApproveDtoWithAddress } from './dto/create-approve.dto';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Approve)
    private approveRepository: Repository<Approve>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @Inject(forwardRef(() => CaverService))
    private caverService: CaverService,
  ) {}

  async findOneByWallet(address: string): Promise<User> {
    return this.userRepository.findOne({ address });
  }

  findApprove(approve: {
    address?: string;
    requestPlace?: string;
    requestDay?: number;
  }): Promise<Approve[]> {
    return this.approveRepository.find(approve);
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
    await this.userRepository.save({
      ...createUserDto,
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
