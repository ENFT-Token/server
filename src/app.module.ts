import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { KasModule } from './kas/kas.module';
import { KasService } from './kas/kas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';

@Module({
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, KasService, UserService],
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,

    AuthModule,
    HttpModule,
    KasModule,
  ],
})
export class AppModule {}
