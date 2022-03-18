import { Module } from '@nestjs/common';
import { CaverService } from './caver.service';
import { CaverController } from './caver.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/user/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [CaverService],
  exports: [CaverService],
  controllers: [CaverController],
})
export class CaverModule {}
