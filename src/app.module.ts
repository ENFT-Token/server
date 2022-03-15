import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { KasModule } from './kas/kas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CaverModule } from './caver/caver.module';
import { BoardModule } from './community/board/board.module';
import { ImageModule } from './community/image/image.module';
import { ImageModule } from './community/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    HttpModule,
    CaverModule,
    BoardModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
