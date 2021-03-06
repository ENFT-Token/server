import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CaverModule } from './caver/caver.module';
import { BoardModule } from './community/board/board.module';
import { AdminModule } from './admin/admin.module';
import { EventsModule } from './events/events.module';
import { CheckModule } from './check/check.module';

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
    AdminModule,
    EventsModule,
    CheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
