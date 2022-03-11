import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { KasModule } from './kas/kas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './admin_user/admin_user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CaverModule } from './caver/caver.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
