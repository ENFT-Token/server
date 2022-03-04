import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserModule } from 'src/admin_user/admin_user.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { KasService } from 'src/kas/kas.service';
import { HttpService } from '@nestjs/axios';
import { KasModule } from 'src/kas/kas.module';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: '5m',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
    KasModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
