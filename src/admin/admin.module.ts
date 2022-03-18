import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaverModule } from 'src/caver/caver.module';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  imports: [UserModule, CaverModule],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
