import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Approve, User, Wallet } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CaverModule } from 'src/caver/caver.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Approve]), CaverModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
