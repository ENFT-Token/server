import { Module } from '@nestjs/common';
import { CheckController } from './check.controller';
import { CheckService } from './check.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Admin, TodayCount } from '../admin/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin, TodayCount])],
  controllers: [CheckController],
  providers: [CheckService],
})
export class CheckModule {}
