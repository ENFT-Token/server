import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaverModule } from 'src/caver/caver.module';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin, PriceInfo } from './admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, PriceInfo]),
    UserModule,
    CaverModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
