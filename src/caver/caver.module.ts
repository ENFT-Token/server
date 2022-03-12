import { Module } from '@nestjs/common';
import { CaverService } from './caver.service';
import { CaverController } from './caver.controller';

@Module({
  providers: [CaverService],
  exports: [CaverService],
  controllers: [CaverController],
})
export class CaverModule {}
