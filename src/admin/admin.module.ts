import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { CaverModule } from 'src/caver/caver.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: '24h',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
    CaverModule,
  ],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
