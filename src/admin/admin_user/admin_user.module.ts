import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './admin_user.entity';
import { UserService } from './admin_user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
