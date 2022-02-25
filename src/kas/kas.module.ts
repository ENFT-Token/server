import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { KasService } from './kas.service';

@Module({
  imports: [HttpModule],
  providers: [KasService],
  exports: [KasService],
})
export class KasModule {}
