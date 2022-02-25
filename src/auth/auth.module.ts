import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth.local.strategy';
import { AuthService } from './auth.service';
import { KasModule } from 'src/kas/kas.module';

@Module({
  imports: [PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
