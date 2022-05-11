import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { UserModule } from 'src/user/user.module';
import { Image } from './image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Image]), UserModule],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
