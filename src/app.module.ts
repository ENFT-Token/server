import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { KasModule } from './kas/kas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
