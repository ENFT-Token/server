import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Approve, User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CaverModule } from 'src/caver/caver.module';
import { Admin } from '../admin/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, Approve]),
    forwardRef(() => CaverModule),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
