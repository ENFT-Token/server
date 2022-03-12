import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminUser } from './admin_user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.adminUserRepository.findOne({
      email: createUserDto.email,
    });
    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '이미 등록된 사용자입니다.',
        error: 'Forbidden',
      });
    }
    const { password, ...result } = createUserDto;
    const bcryptPassword = await bcrypt.hash(password, 10);
    await this.adminUserRepository.save({
      password: bcryptPassword,
      ...result,
    });
    return result;
  }

  async findOneByEmail(email: string) {
    return this.adminUserRepository.findOne({ email });
  }

  async find(options?: FindManyOptions<AdminUser>) {
    return this.adminUserRepository.find(options);
  }
}
