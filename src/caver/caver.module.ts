import { forwardRef, Module } from '@nestjs/common';
import { CaverService } from './caver.service';
import { CaverController } from './caver.controller';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from '../admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Admin } from 'src/admin/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin])],
  providers: [CaverService],
  exports: [CaverService],
  controllers: [CaverController],
})
export class CaverModule {}
