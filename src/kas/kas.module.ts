import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { KasService } from './kas.service';

@Module({
  providers: [KasService],
  imports: [HttpModule],
})
export class KasModule {}
